import { useState, useMemo, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import ReactFlow, {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { useSuccession } from "../../context/SuccessionContext";
import overviewIcon from "../../assets/img/succession/Vector (2).png";
import maleImg from "../../assets/img/succession/you_male.png";
import femaleImg from "../../assets/img/succession/you_female.png";
import fatherImg from "../../assets/img/succession/father.png";
import motherImg from "../../assets/img/succession/mother.png";
import sonImg from "../../assets/img/succession/son.png";
import daughterImg from "../../assets/img/succession/daughter.png";
import brotherImg from "../../assets/img/succession/brother.png";
import sisterImg from "../../assets/img/succession/sister.png";
const AddChildDrawer = lazy(() => import("../../components/succession/AddChildDrawer"));
const SuccessionOverviewDrawer = lazy(() => import("../../components/succession/SuccessionOverviewDrawer"));
const WhatsAppShareModal = lazy(() => import("../../components/succession/WhatsAppShareModal"));
import StyledButton from "../../ui/StyledButton";
const MemberDetailsDrawer = lazy(() => import("../../components/succession/MemberDetailsDrawer"));
import { Plus, MessageCircle } from "lucide-react";
import WhatsAppLogo from "../../assets/img/succession/logos_whatsapp-icon.svg";
import axiosInstance from "../../api/axiosIntercepter";
import { generateTreeBase64 } from "../../utils/tree/generateTreeBase64";

/** -------------------------
 *  IMAGE MAP
 * --------------------------*/
const imageMap = {
  father: fatherImg,
  mother: motherImg,
  son: sonImg,
  daughter: daughterImg,
  brother: brotherImg,
  sister: sisterImg,
};

/** -------------------------
 *  FIXED TEMPLATE (MASTER)
 * --------------------------*/
const TEMPLATE = {
  you: { id: "you", name: "You", relationship: "you", gender: "male" },
  spouse: {
    id: "spouse",
    name: "Spouse",
    relationship: "spouse",
    gender: "female",
  },

  yourParents: [
    {
      id: "your-father",
      name: "Father",
      relationship: "father",
      side: "you",
      gender: "male",
    },
    {
      id: "your-mother",
      name: "Mother",
      relationship: "mother",
      side: "you",
      gender: "female",
    },
  ],

  yourSiblings: [
    {
      id: "your-brother",
      name: "Brother",
      relationship: "brother",
      side: "you",
      gender: "male",
    },
    {
      id: "your-sister",
      name: "Sister",
      relationship: "sister",
      side: "you",
      gender: "female",
    },
  ],

  spouseParents: [
    {
      id: "spouse-father",
      name: "Father",
      relationship: "father",
      side: "spouse",
      gender: "male",
    },
    {
      id: "spouse-mother",
      name: "Mother",
      relationship: "mother",
      side: "spouse",
      gender: "female",
    },
  ],

  spouseSiblings: [
    {
      id: "spouse-brother",
      name: "Brother",
      relationship: "brother",
      side: "spouse",
      gender: "male",
    },
    {
      id: "spouse-sister",
      name: "Sister",
      relationship: "sister",
      side: "spouse",
      gender: "female",
    },
  ],

  children: [
    {
      id: "son-1",
      name: "Son",
      relationship: "son",
      gender: "male",
    },
    {
      id: "daughter-1",
      name: "Daughter",
      relationship: "daughter",
      gender: "female",
    },
  ],
};

/** -------------------------
 *  MEMBER NODE (visual)
 * --------------------------*/
const MemberNode = ({ data }) => {
  const {
    name,
    relationship,
    gender,
    share_percent = 0,
    living_status,
    missing,
    aggregatedCount = 0,
    isAggregatedGroup = false,
    aggregatedMembers = [],
  } = data || {};

  // Calculate total share for aggregated members
  const displaySharePercent =
    isAggregatedGroup && aggregatedMembers.length > 0
      ? aggregatedMembers.reduce((sum, m) => sum + (m.share_percent || 0), 0)
      : share_percent;

  // Determine image
  let imgSrc = imageMap[relationship];
  if (!imgSrc) {
    if (relationship === "you" || relationship === "self") {
      imgSrc = gender === "female" ? femaleImg : maleImg;
    } else if (["spouse", "wife", "husband"].includes(relationship)) {
      imgSrc = gender === "female" ? femaleImg : maleImg;
    } else {
      imgSrc = gender === "female" ? femaleImg : maleImg;
    }
  }

  const isYou = relationship === "you" || relationship === "self";
  const isDeceased = !isYou && living_status === "deceased";

  const baseOpacity = isYou
    ? 1
    : missing
    ? 0.1
    : displaySharePercent === 0
    ? 0.3
    : 1;

  // Format relationship name for display
  const displayRelationship =
    relationship.charAt(0).toUpperCase() + relationship.slice(1);

  // Determine header background color
  const getHeaderBgColor = () => {
    if (isDeceased) return "bg-gray-400";
    return gender === "male"
      ? "bg-gradient-to-b from-[#132F2C] to-[#0F4E14]"
      : "bg-gradient-to-b from-[#DEB541] to-[#F4D57E]";
  };

  // Determine percentage background color
  const getPercentageBgColor = () => {
    if (isDeceased) return "bg-gray-400";
    return gender === "male"
      ? "bg-gradient-to-b from-[#132F2C] to-[#0F4E14]"
      : "bg-gradient-to-b from-[#DEB541] to-[#F4D57E]";
  };

  // Get description from data
  const getDescription = () => {
    if (isAggregatedGroup && aggregatedMembers.length > 0) {
      // For aggregated groups, use the first member's description
      return aggregatedMembers[0]?.description;
    }
    return data?.description;
  };

  const description = getDescription();

  // Check if this is a parent node (father/mother) - show tooltip below
  const isParentNode = relationship === "father" || relationship === "mother";

  return (
    <div className="relative group">
      {/* Hover Tooltip - Show below for parents, above for others */}
      {!missing && description && (
        <div
          className={`absolute left-1/2 transform -translate-x-1/2 ${
            isParentNode ? "top-full mt-2" : "bottom-full mb-2"
          } opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[9999]`}
        >
          <div className="bg-gradient-to-l from-[#132F2C] to-[#0F695F] text-white px-6 py-4 rounded-2xl shadow-xl min-w-[300px] max-w-[400px] relative whitespace-normal">
            <div
              className={`absolute left-1/2 transform -translate-x-1/2 rotate-45 w-4 h-4 bg-gradient-to-l from-[#132F2C] to-[#0F695F] ${
                isParentNode
                  ? "top-0 -translate-y-1/2"
                  : "bottom-0 translate-y-1/2"
              }`}
            ></div>
            <p className="text-center text-2xl leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      )}

      <Handle
        type="target"
        position={Position.Top}
        style={{
          opacity: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <div
        style={{ opacity: baseOpacity }}
        className={`relative w-[240px] h-[340px] ${
          isYou ? getHeaderBgColor() : "bg-white"
        } rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl flex flex-col`}
      >
        {/* Colored Header Section with Avatar/Stacked Avatars */}
        <div
          className={`${
            isYou ? "bg-transparent" : getHeaderBgColor()
          } h-[140px] flex items-center justify-center relative flex-shrink-0`}
        >
          {isAggregatedGroup && aggregatedCount > 1 ? (
            // Stacked avatars for multiple members
            <div className="absolute bottom-[-50px] flex items-center justify-center">
              {[...Array(Math.min(2, aggregatedCount))].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center shadow-md"
                  style={{
                    marginLeft: idx === 0 ? 0 : -40,
                    zIndex: 10 - idx,
                  }}
                >
                  <img
                    src={imgSrc}
                    alt={relationship}
                    loading="lazy"
                    className="w-[100px] h-[100px] object-contain rounded-full"
                  />
                </div>
              ))}
              {aggregatedCount > 2 && (
                <div
                  className="w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center shadow-md"
                  style={{
                    marginLeft: -30,
                    zIndex: 7,
                  }}
                >
                  <span className="text-2xl font-semibold text-gray-700">
                    +{aggregatedCount - 2}
                  </span>
                </div>
              )}
            </div>
          ) : (
            // Single avatar
            <div className="absolute bottom-[-50px] w-[100px] h-[100px] rounded-full bg-white flex items-center justify-center shadow-md">
              <img
                src={imgSrc}
                alt={relationship}
                loading="lazy"
                className={`w-[100px] h-[100px] object-contain rounded-full `}
              />
            </div>
          )}
        </div>

        {/* White Content Section */}
        <div className="pt-[60px] pb-0 px-4 text-center flex-grow flex flex-col justify-center">
          {/* Relationship */}
          <h3
            className={`text-2xl font-medium mb-1 ${
              isYou ? "text-white" : "text-[#2C3E50]"
            }`}
          >
            {displayRelationship}
          </h3>
        </div>

        {/* Percentage Section with Background */}
        {displaySharePercent > 0 ? (
          <div
            className={`${
              isYou ? "bg-transparent" : getPercentageBgColor()
            } py-4 text-center flex-shrink-0`}
          >
            <div className="text-4xl font-bold text-white">
              {typeof displaySharePercent === "number"
                ? Number.isInteger(displaySharePercent)
                  ? displaySharePercent
                  : displaySharePercent.toFixed(2)
                : displaySharePercent}
              <span className="text-3xl">%</span>
            </div>
          </div>
        ) : (
          <div className="h-[68px] flex-shrink-0"></div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          opacity: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />
    </div>
  );
};

/** -------------------------
 *  CUSTOM EDGES
 * --------------------------*/
const HorizontalEdge = (props) => {
  const { sourceX, sourceY, targetX, style } = props;
  const edgePath = `M ${sourceX},${sourceY} L ${targetX},${sourceY}`;
  return (
    <g>
      <path d={edgePath} style={style} fill="none" strokeLinecap="round" />
    </g>
  );
};

const ParentToChildEdge = (props) => {
  const { sourceX, sourceY, targetX, targetY, style, data, markerEnd } = props;

  // Check for custom path first
  if (data?.customPath) {
    return (
      <g>
        <path
          d={data.customPath}
          style={style}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    );
  }

  const parent2X = data?.parent2X;
  const horizontalOpacity =
    data?.horizontalOpacity !== undefined ? data.horizontalOpacity : 1;
  const targetVerticalOpacity =
    data?.targetVerticalOpacity !== undefined ? data.targetVerticalOpacity : 1;
  const branchOpacity =
    data?.branchOpacity !== undefined ? data.branchOpacity : 1;
  const parentConnectorOffset =
    data?.parentConnectorOffset !== undefined ? data.parentConnectorOffset : 36;
  const branchYOffset =
    data?.branchYOffset !== undefined ? data.branchYOffset : 50;

  if (parent2X !== undefined) {
    const centerX = (sourceX + parent2X) / 2;
    const parentConnectorY = sourceY + parentConnectorOffset;
    const parent2StartY = parentConnectorY - parentConnectorOffset;
    const computedBranchY = (parentConnectorY + targetY) / 2 + branchYOffset;
    const branchY = Math.max(
      parentConnectorY + 20,
      Math.min(targetY - 20, computedBranchY)
    );

    const verticalParent1Path = `M ${sourceX},${sourceY} L ${sourceX},${parentConnectorY}`;
    const verticalParent2Path = `M ${parent2X},${parent2StartY} L ${parent2X},${parentConnectorY}`;
    const horizontalParentPath = `M ${sourceX},${parentConnectorY} L ${parent2X},${parentConnectorY}`;
    const verticalToBranchPath = `M ${centerX},${parentConnectorY} L ${centerX},${branchY}`;
    const horizontalBranchPath = `M ${centerX},${branchY} L ${targetX},${branchY}`;
    const verticalToTargetPath = `M ${targetX},${branchY} L ${targetX},${targetY}`;

    return (
      <g>
        {/* Vertical connectors from each parent down to the shared horizontal line */}
        <path
          d={verticalParent1Path}
          style={{ ...style, opacity: horizontalOpacity }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={verticalParent2Path}
          style={{ ...style, opacity: horizontalOpacity }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Horizontal line between parents */}
        <path
          d={horizontalParentPath}
          style={{ ...style, opacity: horizontalOpacity }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Vertical line from parent center down to branch level */}
        <path
          d={verticalToBranchPath}
          style={style}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Horizontal line at branch level (connecting siblings/children) */}
        <path
          d={horizontalBranchPath}
          style={{ ...style, opacity: branchOpacity }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Vertical to target with arrow marker */}
        <path
          d={verticalToTargetPath}
          style={{ ...style, opacity: targetVerticalOpacity }}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={data?.showArrow ? markerEnd : undefined}
        />
      </g>
    );
  } else {
    const midY = (sourceY + targetY) / 2;
    const edgePath = `
      M ${sourceX},${sourceY}
      L ${sourceX},${midY}
      L ${targetX},${midY}
      L ${targetX},${targetY}
    `;

    return (
      <g>
        <path
          d={edgePath}
          style={style}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          markerEnd={data?.showArrow ? markerEnd : undefined}
        />
      </g>
    );
  }
};

const EDGE_TYPES = {
  horizontal: HorizontalEdge,
  parentToChild: ParentToChildEdge,
};

const NODE_TYPES = {
  memberNode: MemberNode,
};

/** -------------------------
 *  HELPER FUNCTIONS
 * --------------------------*/
const findByRole = (arr, role) => {
  if (!arr || !Array.isArray(arr)) return null;
  return arr.find((m) => {
    if (!m) return false;
    if (m.relationship && m.relationship === role) return true;
    if (m.role && m.role === role) return true;
    return false;
  });
};

const belongsToYou = (member, yourGender) => {
  if (!member || !member.heir_type) return true;
  const heirType = String(member.heir_type).toLowerCase();

  // Determine based on gender and heir_type
  if (yourGender === "male") {
    // If you are male:
    // - "husbands_*" or "husband_*" = YOUR family (you are the husband)
    // - "wife_*" or "wifes_*" = SPOUSE's family (your wife)
    if (heirType.startsWith("husband") || heirType.startsWith("husbands_")) {
      return true; // Your family
    }
    if (heirType.startsWith("wife_") || heirType.startsWith("wifes_")) {
      return false; // Spouse's family
    }
  } else if (yourGender === "female") {
    // If you are female:
    // - "wife_*" or "wifes_*" = YOUR family (you are the wife)
    // - "husbands_*" or "husband_*" = SPOUSE's family (your husband)
    if (heirType.startsWith("wife_") || heirType.startsWith("wifes_")) {
      return true; // Your family
    }
    if (heirType.startsWith("husband") || heirType.startsWith("husbands_")) {
      return false; // Spouse's family
    }
  }

  // Default: if no prefix, belongs to "you"
  return true;
};

const markMissing = (templateMember, responseCandidate) => {
  if (responseCandidate) {
    return { ...responseCandidate, missing: false };
  }
  return { ...templateMember, missing: true };
};

const capitalize = (text = "") => text.charAt(0).toUpperCase() + text.slice(1);

const pluralizeRelationship = (relationship = "", count = 0) => {
  const singular = capitalize(relationship);
  if (count === 1) return singular;
  if (relationship === "son") return "Sons";
  if (relationship === "daughter") return "Daughters";
  if (relationship === "child") return "Children";
  if (singular.endsWith("s")) return singular;
  return `${singular}s`;
};

const defaultGenderForRelationship = (relationship = "") => {
  const femaleRelationships = ["sister", "daughter", "mother", "wife"];
  return femaleRelationships.includes(relationship) ? "female" : "male";
};

const aggregateMembersByRelationship = (members = [], prefix) => {
  const order = [];
  const groups = members.reduce((acc, member, index) => {
    const relKey = (
      member.relationship || (member.gender === "female" ? "sister" : "brother")
    ).toLowerCase();
    if (!acc[relKey]) {
      acc[relKey] = {
        ...member,
        id: `${prefix}-${relKey}`,
        relationship: relKey,
        gender: member.gender || defaultGenderForRelationship(relKey),
        aggregatedCount: 0,
        missing: true,
        aggregatedMembers: [],
      };
      order.push(relKey);
    }

    if (!member.missing) {
      acc[relKey].aggregatedCount += 1;
      acc[relKey].missing = false;
      acc[relKey].aggregatedMembers.push({
        ...member,
        id: member.id || `${prefix}-${relKey}-${index}`,
      });
    }

    return acc;
  }, {});

  return order.map((key) => {
    const group = groups[key];
    const count = group.aggregatedCount;
    const displayName =
      count > 0
        ? `${count} ${pluralizeRelationship(group.relationship, count)}`
        : group.name || capitalize(group.relationship);

    return {
      ...group,
      name: displayName,
      isAggregatedGroup: group.aggregatedMembers.length > 0,
    };
  });
};

const ensureTemplatePlaceholders = (members = [], template = []) => {
  const existingRelationships = new Set(
    members.map((member) => (member.relationship || "").toLowerCase())
  );

  const placeholders = template
    .filter(
      (tpl) =>
        !existingRelationships.has((tpl.relationship || "").toLowerCase())
    )
    .map((tpl) => ({ ...tpl, missing: true }));

  return [...members, ...placeholders];
};

/**
 * buildTree(finalTree, handleAddChildClick)
 * Pure function — returns stable nodes/edges.
 */
function buildTree(finalTree, handleAddChildClick) {
  const nodes = [];
  const edges = [];

  const centerX = 1000;
  const parentY = 0;
  const selfY = 550;
  const childrenY = 1100;
  const siblingsY = 550;

  const parentSpacing = 350;
  const siblingSpacing = 320;
  const childSpacing = 320;

  const youIsFemale = finalTree.you.gender === "female";

  const youX = youIsFemale ? centerX + 180 : centerX - 180;
  const spouseX = youIsFemale ? centerX - 180 : centerX + 180;

  const yourParentsStartX = youIsFemale ? centerX + 180 : centerX - 530;
  const spouseParentsStartX = youIsFemale ? centerX - 530 : centerX + 180;

  /** -------------------------
   * YOUR PARENTS
   * --------------------------*/
  const youHasVisibleSiblings = finalTree.yourSiblings.some((s) => !s.missing);
  finalTree.yourParents.forEach((p, idx) => {
    const x = yourParentsStartX + idx * parentSpacing;
    nodes.push({
      id: p.id,
      type: "memberNode",
      position: { x, y: parentY },
      data: { ...p },
    });
  });

  /** -------------------------
   * SPOUSE PARENTS
   * --------------------------*/
  const spouseHasVisibleSiblings = finalTree.spouseSiblings.some(
    (s) => !s.missing
  );
  finalTree.spouseParents.forEach((p, idx) => {
    const x = spouseParentsStartX + idx * parentSpacing;
    nodes.push({
      id: p.id,
      type: "memberNode",
      position: { x, y: parentY },
      data: { ...p },
    });
  });

  /** -------------------------
   * CONNECT YOUR PARENTS → YOU
   * --------------------------*/
  if (finalTree.yourParents.length === 2) {
    const parent2X = yourParentsStartX + parentSpacing + 120;
    edges.push({
      id: "e-yourparents-you",
      source: finalTree.yourParents[0].id,
      target: finalTree.you.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        parent2X,
        parent2Y: parentY + 30,
        showArrow: false,
        horizontalOpacity: 1,
        branchOpacity: youHasVisibleSiblings ? 1 : 1,
        targetVerticalOpacity: youHasVisibleSiblings ? 1 : 1,
      },
    });
  } else if (finalTree.yourParents.length === 1) {
    // Single parent - direct connection
    edges.push({
      id: "e-yourparent-you",
      source: finalTree.yourParents[0].id,
      target: finalTree.you.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        showArrow: false,
      },
    });
  }

  /** -------------------------
   * CONNECT SPOUSE PARENTS → SPOUSE
   * --------------------------*/
  if (finalTree.spouse && finalTree.spouseParents.length === 2) {
    const parent2X = spouseParentsStartX + parentSpacing + 120;
    edges.push({
      id: "e-spouseparents-spouse",
      source: finalTree.spouseParents[0].id,
      target: finalTree.spouse.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        parent2X,
        parent2Y: parentY + 30,
        showArrow: false,
        horizontalOpacity: 1,
        branchOpacity: spouseHasVisibleSiblings ? 1 : 1,
        targetVerticalOpacity: spouseHasVisibleSiblings ? 1 : 1,
      },
    });
  } else if (finalTree.spouse && finalTree.spouseParents.length === 1) {
    // Single parent - direct connection
    edges.push({
      id: "e-spouseparent-spouse",
      source: finalTree.spouseParents[0].id,
      target: finalTree.spouse.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        showArrow: false,
      },
    });
  }

  /** -------------------------
   * YOUR SIBLINGS
   * --------------------------*/
  const siblingSideOffset = 600;
  const yourSiblingsCount = finalTree.yourSiblings.length;
  const yourSiblingsTotalWidth = (yourSiblingsCount - 1) * siblingSpacing;
  const yourSiblingsStartX = youIsFemale
    ? centerX + siblingSideOffset
    : centerX - siblingSideOffset - yourSiblingsTotalWidth;

  const visibleYourSiblings = finalTree.yourSiblings.filter(
    (sib) => !sib.missing
  );
  const hasVisibleYourSiblingGroup =
    visibleYourSiblings.length > 1 ||
    visibleYourSiblings.some((sib) => (sib.aggregatedCount || 0) > 1);

  finalTree.yourSiblings.forEach((sib, idx) => {
    const x = yourSiblingsStartX + idx * siblingSpacing;
    nodes.push({
      id: sib.id,
      type: "memberNode",
      position: { x, y: siblingsY },
      data: { ...sib },
    });

    if (finalTree.yourParents.length === 2) {
      const parent2X = yourParentsStartX + parentSpacing + 120;
      const forceVisibleBranch = hasVisibleYourSiblingGroup && !sib.missing;

      edges.push({
        id: `e-yourparent-${sib.id}`,
        source: finalTree.yourParents[0].id,
        target: sib.id,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: 1,
        },
        data: {
          parent2X,
          parent2Y: parentY + 30,
          showArrow: false,
          horizontalOpacity: 1,
          branchOpacity: forceVisibleBranch ? 1 : 1,
          targetVerticalOpacity: forceVisibleBranch ? 1 : 1,
        },
      });
    } else if (finalTree.yourParents.length === 1) {
      // Single parent to sibling
      edges.push({
        id: `e-yourparent-${sib.id}`,
        source: finalTree.yourParents[0].id,
        target: sib.id,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: 1,
        },
        data: {
          showArrow: false,
        },
      });
    }
  });

  // Add horizontal branch line connecting You and siblings when no parents
  if (finalTree.yourParents.length === 0 && finalTree.yourSiblings.length > 0) {
    const branchY = selfY - 100;
    const leftmostX = Math.min(youX, yourSiblingsStartX);
    const rightmostX = Math.max(
      youX,
      yourSiblingsStartX + (yourSiblingsCount - 1) * siblingSpacing
    );

    // Vertical from You to branch
    edges.push({
      id: "e-you-to-branch",
      source: finalTree.you.id,
      target: finalTree.you.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        showArrow: false,
        customPath: `M ${youX + 120},${selfY} L ${youX + 120},${branchY}`,
      },
    });

    // Horizontal branch line
    edges.push({
      id: "e-sibling-branch-horizontal",
      source: finalTree.you.id,
      target: finalTree.you.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        showArrow: false,
        customPath: `M ${leftmostX + 120},${branchY} L ${
          rightmostX + 120
        },${branchY}`,
      },
    });

    // Vertical lines from branch to each sibling
    finalTree.yourSiblings.forEach((sib, idx) => {
      const x = yourSiblingsStartX + idx * siblingSpacing;
      edges.push({
        id: `e-branch-to-sibling-${sib.id}`,
        source: finalTree.you.id,
        target: sib.id,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: 1,
        },
        data: {
          showArrow: false,
          customPath: `M ${x + 120},${branchY} L ${x + 120},${siblingsY}`,
        },
      });
    });
  }

  /** -------------------------
   * SPOUSE SIBLINGS
   * --------------------------*/
  const spouseSiblingsCount = finalTree.spouseSiblings.length;
  const spouseSiblingsTotalWidth = (spouseSiblingsCount - 1) * siblingSpacing;
  const spouseSiblingsStartX = youIsFemale
    ? centerX - siblingSideOffset - spouseSiblingsTotalWidth
    : centerX + siblingSideOffset;

  const visibleSpouseSiblings = finalTree.spouseSiblings.filter(
    (sib) => !sib.missing
  );
  const hasVisibleSpouseSiblingGroup =
    visibleSpouseSiblings.length > 1 ||
    visibleSpouseSiblings.some((sib) => (sib.aggregatedCount || 0) > 1);

  finalTree.spouseSiblings.forEach((sib, idx) => {
    const x = spouseSiblingsStartX + idx * siblingSpacing;
    nodes.push({
      id: sib.id,
      type: "memberNode",
      position: { x, y: siblingsY },
      data: { ...sib },
    });

    if (finalTree.spouseParents.length === 2) {
      const parent2X = spouseParentsStartX + parentSpacing + 120;
      const forceVisibleBranch = hasVisibleSpouseSiblingGroup && !sib.missing;

      edges.push({
        id: `e-spouseparent-${sib.id}`,
        source: finalTree.spouseParents[0].id,
        target: sib.id,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: 1,
        },
        data: {
          parent2X,
          parent2Y: parentY + 30,
          showArrow: false,
          horizontalOpacity: 1,
          branchOpacity: forceVisibleBranch ? 1 : 1,
          targetVerticalOpacity: forceVisibleBranch ? 1 : 1,
        },
      });
    } else if (finalTree.spouseParents.length === 1) {
      // Single parent to sibling
      edges.push({
        id: `e-spouseparent-${sib.id}`,
        source: finalTree.spouseParents[0].id,
        target: sib.id,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: 1,
        },
        data: {
          showArrow: false,
        },
      });
    } else if (finalTree.spouseParents.length === 0 && finalTree.spouse) {
      // No parents - connect siblings horizontally to Spouse
      edges.push({
        id: `e-spouse-sibling-${sib.id}`,
        source: finalTree.spouse.id,
        target: sib.id,
        type: "horizontal",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: 1,
        },
      });
    }
  });

  /** -------------------------
   * YOU & SPOUSE
   * --------------------------*/
  nodes.push({
    id: finalTree.you.id,
    type: "memberNode",
    position: { x: youX, y: selfY },
    data: { ...finalTree.you, relationship: "you" },
  });

  // Only add spouse node if spouse exists
  if (finalTree.spouse) {
    nodes.push({
      id: finalTree.spouse.id,
      type: "memberNode",
      position: { x: spouseX, y: selfY },
      data: { ...finalTree.spouse, relationship: "spouse" },
    });

    // Add U-shaped connection between You and Spouse (from bottom of cards)
    const connectionY = selfY + 370; // Below the cards
    edges.push({
      id: "e-you-spouse",
      source: finalTree.you.id,
      target: finalTree.spouse.id,
      type: "parentToChild",
      style: {
        stroke: "#000",
        strokeWidth: 1,
        strokeDasharray: "5,5",
        opacity: 1,
      },
      data: {
        showArrow: false,
        customPath: `M ${youX + 120},${selfY + 340} L ${
          youX + 120
        },${connectionY} L ${spouseX + 120},${connectionY} L ${spouseX + 120},${
          selfY + 340
        }`,
      },
    });
  }

  /** -------------------------
   * CHILDREN (NO ADD CHILD NODE)
   * --------------------------*/
  const children = finalTree.children;
  const totalSlots = children.length;
  const startX = centerX - ((totalSlots - 1) * childSpacing) / 2;

  children.forEach((child, idx) => {
    const x = startX + idx * childSpacing;
    const childId = child.id || `child-${idx}`;

    nodes.push({
      id: childId,
      type: "memberNode",
      position: { x, y: childrenY },
      data: child,
    });

    const spouseExists = finalTree.spouse !== null;
    const youIsDeceased = finalTree.you.living_status === "deceased";
    const childExists = !child.missing;

    // Show connection if: child exists AND (you are alive OR you are deceased but child is visible)
    const shouldShowConnection = childExists || (youIsDeceased && childExists);

    // If spouse exists, connect from the U-shaped connection point
    if (spouseExists) {
      const connectionY = selfY + 370; // Same Y as U-shaped connection
      const centerX = (youX + spouseX) / 2 + 120; // Center between You and Spouse

      edges.push({
        id: `e-parents-child-${childId}`,
        source: finalTree.you.id,
        target: childId,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: shouldShowConnection ? 1 : 0.03,
        },
        data: {
          showArrow: false,
          customPath: `M ${centerX},${connectionY} L ${centerX},${
            (connectionY + childrenY) / 2
          } L ${x + 120},${(connectionY + childrenY) / 2} L ${
            x + 120
          },${childrenY}`,
        },
      });
    } else {
      // Single parent edge - direct connection from You to child
      edges.push({
        id: `e-you-child-${childId}`,
        source: finalTree.you.id,
        target: childId,
        type: "parentToChild",
        style: {
          stroke: "#000",
          strokeWidth: 1,
          strokeDasharray: "5,5",
          opacity: shouldShowConnection ? 1 : 0.03,
        },
        data: {
          showArrow: false,
        },
      });
    }
  });

  return { nodes, edges };
}

/** -------------------------
 *  MAIN COMPONENT
 * --------------------------*/
const SuccessionTreeFlow = () => {
  const { successionData } = useSuccession();
  const isLargeScreen =
    typeof window !== "undefined" && window.innerWidth >= 1024;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOverviewOpen, setIsOverviewOpen] = useState(isLargeScreen);
  const [isMemberDrawerOpen, setIsMemberDrawerOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [capturedTreeImage, setCapturedTreeImage] = useState(null);
  const hasAutoOpenedWhatsAppModal = useRef(false);
  
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  // Listen for custom events to open add member drawer from overview
  useEffect(() => {
    const handleOpenAddMemberDrawer = () => {
      setIsDrawerOpen(true);
    };

    window.addEventListener('openAddMemberDrawer', handleOpenAddMemberDrawer);

    return () => {
      window.removeEventListener('openAddMemberDrawer', handleOpenAddMemberDrawer);
    };
  }, []);

  const handleAddChildClick = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const treeResponse = successionData?.survey?.family_tree || {};

  /** -------------------------
   * MERGE API DATA WITH TEMPLATE
   * --------------------------*/
  const finalTree = useMemo(() => {
    const resp = treeResponse || {};

    const youNode = markMissing(TEMPLATE.you, {
      id: resp.id || TEMPLATE.you.id,
      name: resp.name || TEMPLATE.you.name,
      relationship: "you",
      gender: resp.gender || TEMPLATE.you.gender,
      ...resp,
    });

    const spouseResp = resp.spouse || null;
    const oppositeGender = youNode.gender === "male" ? "female" : "male";

    // Only create spouse node if spouse exists in response
    const spouseNode = spouseResp
      ? {
          id: spouseResp.id || TEMPLATE.spouse.id,
          name: spouseResp.name || TEMPLATE.spouse.name,
          relationship: "spouse",
          gender: spouseResp.gender || oppositeGender,
          missing: false,
          ...spouseResp,
        }
      : null;

    const allParents = resp.parents || [];
    const allSiblings = resp.siblings || [];

    const yourParentsResponse = allParents.filter((p) =>
      belongsToYou(p, youNode.gender)
    );
    const spouseParentsResponse = allParents.filter(
      (p) => !belongsToYou(p, youNode.gender)
    );

    const yourSiblingsResponse = allSiblings.filter((s) =>
      belongsToYou(s, youNode.gender)
    );
    const spouseSiblingsResponse = allSiblings.filter(
      (s) => !belongsToYou(s, youNode.gender)
    );

    // Only show parents that exist in response
    const yourParents = yourParentsResponse.map((p, idx) => ({
      id: p.id || `your-parent-${idx}`,
      name: p.name || p.relationship || "Parent",
      relationship: p.relationship,
      gender: p.gender || (p.relationship === "mother" ? "female" : "male"),
      missing: false,
      ...p,
    }));

    // Only show siblings that exist in response
    const yourSiblings = yourSiblingsResponse.map((sib, idx) => ({
      id: sib.id || `your-sibling-${idx}`,
      name: sib.name || sib.relationship || "Sibling",
      relationship:
        sib.relationship || (sib.gender === "female" ? "sister" : "brother"),
      gender: sib.gender || "male",
      missing: false,
      ...sib,
    }));

    // Only show spouse parents that exist in response
    const spouseParents = spouseParentsResponse.map((p, idx) => ({
      id: p.id || `spouse-parent-${idx}`,
      name: p.name || p.relationship || "Parent",
      relationship: p.relationship,
      gender: p.gender || (p.relationship === "mother" ? "female" : "male"),
      missing: false,
      ...p,
    }));

    // Only show spouse siblings that exist in response
    const spouseSiblings = spouseSiblingsResponse.map((sib, idx) => ({
      id: sib.id || `spouse-sibling-${idx}`,
      name: sib.name || sib.relationship || "Sibling",
      relationship:
        sib.relationship || (sib.gender === "female" ? "sister" : "brother"),
      gender: sib.gender || "male",
      missing: false,
      ...sib,
    }));

    // Only show children that exist in response
    const children =
      Array.isArray(resp.children) && resp.children.length > 0
        ? resp.children.map((c, idx) => ({
            id: c.id || `child-${idx}`,
            name: c.name || c.relationship || "Child",
            relationship:
              c.relationship || (c.gender === "female" ? "daughter" : "son"),
            gender: c.gender || "male",
            missing: false,
            ...c,
          }))
        : [];

    const aggregatedYourSiblings =
      yourSiblings.length > 0
        ? aggregateMembersByRelationship(yourSiblings, "your-sibling")
        : [];

    const aggregatedSpouseSiblings =
      spouseSiblings.length > 0
        ? aggregateMembersByRelationship(spouseSiblings, "spouse-sibling")
        : [];

    const aggregatedChildren =
      children.length > 0
        ? aggregateMembersByRelationship(children, "child")
        : [];

    return {
      you: youNode,
      spouse: spouseNode,
      yourParents,
      yourSiblings: aggregatedYourSiblings,
      spouseParents,
      spouseSiblings: aggregatedSpouseSiblings,
      children: aggregatedChildren,
    };
  }, [treeResponse]);

  /** -------------------------
   * BUILD NODES & EDGES
   * --------------------------*/
  const { nodes: calcNodes, edges: calcEdges } = useMemo(() => {
    return buildTree(finalTree, handleAddChildClick);
  }, [finalTree, handleAddChildClick]);

  /** -------------------------
   * REACT FLOW STATE
   * --------------------------*/
  const [nodes, setNodes, onNodesChange] = useNodesState(calcNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(calcEdges);

  // Capture tree image once after nodes are rendered
  useEffect(() => {
    if (capturedTreeImage) return;
    if (!nodes || nodes.length === 0) return;

    const timer = setTimeout(async () => {
      try {
        if (reactFlowInstance.current) {
          reactFlowInstance.current.fitView({
            padding: isMobile ? 0.25 : 0.7,
            duration: 600,
            minZoom: isMobile ? 0.25 : 0.35,
            maxZoom: isMobile ? 0.4 : 0.6,
          });
        }

        await new Promise((resolve) => setTimeout(resolve, 700));

        const treeEl = document.getElementById("tree");
        if (treeEl) {
          const imgs = Array.from(treeEl.querySelectorAll("img"));
          await Promise.all(
            imgs.map(
              (img) =>
                new Promise((resolve) => {
                  if (img.complete) return resolve();
                  img.addEventListener("load", resolve, { once: true });
                  img.addEventListener("error", resolve, { once: true });
                })
            )
          );
          await new Promise((resolve) => requestAnimationFrame(() => resolve()));
        }

        console.log('📸 Capturing tree image...');
        const treeImage = await generateTreeBase64();
        if (treeImage) {
          setCapturedTreeImage(treeImage);
          console.log('✅ Tree image captured');
        }
      } catch (error) {
        console.warn('⚠️ Failed to capture tree image:', error);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [nodes, capturedTreeImage]);

  // Auto-open WhatsApp modal 2 seconds after successful tree capture (one-time)
  useEffect(() => {
    if (hasAutoOpenedWhatsAppModal.current) return;
    if (!capturedTreeImage) return;

    const timer = setTimeout(() => {
      if (hasAutoOpenedWhatsAppModal.current) return;
      setShowWhatsAppModal(true);
      hasAutoOpenedWhatsAppModal.current = true;
    }, 4000);

    return () => clearTimeout(timer);
  }, [capturedTreeImage]);

  /** -------------------------
   * UPDATE WHEN CALC CHANGES
   * --------------------------*/
  const prevNodesRef = useRef(calcNodes);
  const prevEdgesRef = useRef(calcEdges);

  const reactFlowInstance = useRef(null);

  useEffect(() => {
    const sameNodes =
      JSON.stringify(prevNodesRef.current) === JSON.stringify(calcNodes);
    const sameEdges =
      JSON.stringify(prevEdgesRef.current) === JSON.stringify(calcEdges);

    if (!sameNodes) {
      prevNodesRef.current = calcNodes;
      setNodes(calcNodes);

      // Fit view after nodes update
      setTimeout(() => {
        if (reactFlowInstance.current) {
          reactFlowInstance.current.fitView({
            padding: isMobile ? 0.25 : 0.7,
            duration: 400,
            minZoom: isMobile ? 0.25 : 0.35,
            maxZoom: isMobile ? 0.4 : 0.6,
          });
        }
      }, 100);
    }

    if (!sameEdges) {
      prevEdgesRef.current = calcEdges;
      setEdges(calcEdges);
    }
  }, [calcNodes, calcEdges, setNodes, setEdges, isMobile]);

  /** -------------------------
   * NODE CLICK HANDLER
   * --------------------------*/
  const onNodeClick = (_, node) => {
    if (node.data?.missing) return;

    setSelectedMember(node.data);
    setIsMemberDrawerOpen(true);
  };

  /** -------------------------
   * LISTEN FOR CLOSE DRAWERS EVENT
   * --------------------------*/
  useEffect(() => {
    const handleCloseDrawers = () => {
      setIsMemberDrawerOpen(false);
      setIsDrawerOpen(false);
      setIsOverviewOpen(false);
    };

    const checkDrawersOpen = (e) => {
      e.detail.hasOpenDrawers =
        isMemberDrawerOpen || isDrawerOpen || isOverviewOpen;
    };

    // Clear succession data when tab is closed (not on refresh)
    const handleBeforeUnload = () => {
      // Only clear localStorage (sessionStorage will persist for refresh)
      localStorage.removeItem('successionData');
      localStorage.removeItem('successionTree');
    };

    window.addEventListener("closeDrawers", handleCloseDrawers);
    window.addEventListener("checkDrawersOpen", checkDrawersOpen);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener("closeDrawers", handleCloseDrawers);
      window.removeEventListener("checkDrawersOpen", checkDrawersOpen);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isMemberDrawerOpen, isDrawerOpen, isOverviewOpen]);

  /** -------------------------
   * UPDATE SELECTED MEMBER WHEN DATA CHANGES
   * --------------------------*/
  useEffect(() => {
    if (selectedMember && isMemberDrawerOpen) {
      // Find the updated member data from finalTree
      const findUpdatedMember = () => {
        const allMembers = [
          ...finalTree.yourSiblings,
          ...finalTree.spouseSiblings,
          ...finalTree.children,
          finalTree.you,
          ...(finalTree.spouse ? [finalTree.spouse] : []),
          ...finalTree.yourParents,
          ...finalTree.spouseParents,
        ];

        return allMembers.find((m) => m && m.id === selectedMember.id);
      };

      const updatedMember = findUpdatedMember();
      if (updatedMember) {
        setSelectedMember(updatedMember);
      }
    }
  }, [finalTree, selectedMember, isMemberDrawerOpen]);

  return (
    <>
      <div className="w-full h-[70vh] md:h-[80vh] flex flex-col items-center relative">
        <div id="tree" className="w-full h-[68vh] md:h-[85vh] overflow-visible ">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            onNodeClick={onNodeClick}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
              // Store instance globally for tree capture
              window.reactFlowInstance = instance;
            }}
            fitView
            fitViewOptions={{
              padding: isMobile ? 0.25 : 0.7,
              duration: 400,
              minZoom: isMobile ? 0.25 : 0.35,
              maxZoom: isMobile ? 0.4 : 0.6,
            }}
            minZoom={0.1}
            maxZoom={1.5}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll={true}
            zoomOnPinch={true}
            panOnDrag={true}
            panOnScroll={false}
            proOptions={{ hideAttribution: true }}
            style={{ overflow: "visible" }}
          >
            <svg width="0" height="0">
              <defs>
                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D3921C" />
                  <stop offset="33%" stopColor="#F2DE9A" />
                  <stop offset="100%" stopColor="#D3921C" />
                </linearGradient>
              </defs>
            </svg>

            {/* <Background variant="dots" gap={18} color="#ddd" />  */}
            <Controls
              showZoom={true}
              showFitView={true}
              showInteractive={false}
              fitViewOptions={{
                padding: isMobile ? 0.25 : 0.7,
                duration: 400,
                minZoom: isMobile ? 0.25 : 0.35,
                maxZoom: isMobile ? 0.4 : 0.6,
              }}
            />
          </ReactFlow>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => setIsOverviewOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-[#0B1C15] rounded-full shadow-sm border border-gray-200 text-lg transition-all duration-200 hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#000]/40"
          >
            <img src={overviewIcon} alt="Overview Icon" loading="lazy" className="w-5 h-5" />
            <span className="text-[#0B1C15] tracking-wide">Overview</span>
          </button>
        </div>

        <div className="absolute bottom-15 left-6 right-6 z-10 flex justify-end">
          <div className="flex flex-col gap-3 md:hidden">
            <StyledButton
              minWidth="10px"
              className="bg-white hover:bg-gray-100 text-black border border-gray-300 rounded-lg"
              name={
                <>
                  <img src={WhatsAppLogo} alt="WhatsApp" className="w-5 h-5"
                  loading="lazy"
                  decoding="async"
                  />
                  <span>Get Detailed Report</span>
                </>
              }
              onClick={() => setShowWhatsAppModal(true)}
            />
          </div>
        </div>
      </div>

      <AddChildDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
      <MemberDetailsDrawer
        open={isMemberDrawerOpen}
        onClose={() => setIsMemberDrawerOpen(false)}
        member={selectedMember}
        onMemberSelect={(memberData) => {
          if (!memberData) return;
          setSelectedMember(memberData);
        }}
      />
      <SuccessionOverviewDrawer
        open={isOverviewOpen}
        onClose={() => setIsOverviewOpen(false)}
        summaryData={finalTree}
      />
      {showWhatsAppModal && (
        <WhatsAppShareModal
          successionId={successionData?.survey?.id}
          preCapturedTreeImage={capturedTreeImage || successionData?.capturedTreeImage}
          onClose={() => setShowWhatsAppModal(false)}
        />
      )}
    </>
  );
};

/** -------------------------
 *  EXPORT WRAPPED PROVIDER
 * --------------------------*/
export default function SuccessionTree() {
  return (
    <ReactFlowProvider>
      <SuccessionTreeFlow />
    </ReactFlowProvider>
  );
}
