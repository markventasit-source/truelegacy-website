import { useState, lazy, Suspense } from "react";
import { Download, Users, X, Plus } from "lucide-react";
import StyledButton from "../../ui/StyledButton";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { useSuccession } from "../../context/SuccessionContext";
import { getMemberImage } from "../../utils/getMemberImage";
import { generateSuccessionPDF } from "../../utils/generateSuccessionPDF";
const RequestDialog = lazy(() => import("../home/RequestDialog"));

const relationshipColors = {
  spouse: "#D3222B", // Red
  mother: "#11B71F", // Green
  father: "#FF7E00", // Orange
  son: "#0787FF", // Blue
  daughter: "#9D1ADE", // Purple
  brother: "#008080", // Teal
  sister: "#E91E63", // Pink
  you: "#FFAF44", // Golden yellow
};

const SuccessionOverviewDrawer = ({ open, onClose }) => {
  const { successionData } = useSuccession();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to handle opening the add member drawer
  const handleAddMember = () => {
    // Close the overview drawer first
    onClose();
    // Open the add member drawer by dispatching a custom event
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("openAddMemberDrawer"));
    }, 100);
  };

  if (!open) return null;

  const tree = successionData?.survey?.family_tree;
  if (!tree) {
    return (
      <div className="absolute inset-0 z-50 flex justify-end bg-black/20 backdrop-blur-[2px]">
        <div className="w-full sm:w-[450px] bg-white h-full shadow-xl p-6 flex flex-col items-center justify-center">
          <p className="text-gray-600">No data available for summary.</p>
          <StyledButton
            name="Close"
            onClick={onClose}
            className="mt-4 bg-[#034909] text-white"
          />
        </div>
      </div>
    );
  }

  const members = [
    { ...tree, relationship: "you" },
    ...(tree.parents || []),
    ...(tree.children || []),
    ...(tree.siblings || []),
    ...(tree.spouse ? [tree.spouse] : []),
  ];

  // Get user's gender
  const userGender = tree?.gender?.toLowerCase();

  const summaryData = members.map((m) => {
    // Normalize relationship for color mapping
    let normalizedRelationship = m.relationship?.toLowerCase();

    // Map wife/husband to spouse for color consistency
    if (
      normalizedRelationship === "wife" ||
      normalizedRelationship === "husband"
    ) {
      normalizedRelationship = "spouse";
    }

    // Transform heir_type based on user's gender
    let displayHeirType = m.heir_type;
    if (displayHeirType) {
      if (userGender === "female") {
        // If user is female, replace "wife_" or "wifes_" with "your_"
        displayHeirType = displayHeirType.replace(/^wife_|^wifes_/i, "your_");
      } else if (userGender === "male") {
        // If user is male, replace "husband_" or "husbands_" with "your_"
        displayHeirType = displayHeirType.replace(/^husband_|^husbands_/i, "your_");
      }
    }

    return {
      name: m.name || m.relationship || "Unnamed",
      value: m.share_percent || 0,
      status: m.living_status || "alive",
      relationship: m.relationship,
      heir_type: displayHeirType,
      image: getMemberImage(m.relationship, m.gender),
      color: relationshipColors[normalizedRelationship] || "#F28E8E",
      normalizedRelationship, // Keep for legend display
    };
  });

  // Filter for pie chart - only members with share
  const pieChartData = summaryData.filter((m) => m.value > 0);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const displayName = data.normalizedRelationship
        ? data.normalizedRelationship.charAt(0).toUpperCase() +
          data.normalizedRelationship.slice(1)
        : data.name;

      return (
        <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 capitalize">
            {displayName}
          </p>
          <p className="text-lg font-bold text-primary">
            {data.value.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      if (summaryData && successionData) {
        await generateSuccessionPDF(summaryData, successionData);
      }
    } catch (error) {
      console.error("PDF Generation Failed:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={`absolute inset-0 z-[999] flex justify-end transition-opacity  ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full sm:w-[450px] bg-white h-[80vh] shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-end mb-8">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black flex items-center gap-1"
          >
            Close <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-medium text-primary mb-1">
            Succession Summary
          </h2>
          {/* <p className="text-secondary text-base font-medium">
            (Based on Applicable Law) According to Hindu Succession Act, Section
            10
          </p> */}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-100 px-4 py-2.5">
            <h3 className="text-base font-medium text-primary">
              Estate Distribution
            </h3>
          </div>

          <div className="p-5 flex flex-col items-center justify-center">
            <div className="w-[230px] h-[230px] flex items-center justify-center ">
              <PieChart width={230} height={230}>
                <Pie
                  data={pieChartData}
                  cx={115}
                  cy={115}
                  innerRadius={60}
                  outerRadius={90}
                  dataKey="value"
                  stroke="#fff"
                  strokeWidth={2}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </div>
            <div className="grid grid-cols-3 gap-y-2 gap-x-6 mt-3">
              {pieChartData.slice(0, 6).map((entry, index) => {
                // Display relationship type for legend
                let displayName =
                  entry.normalizedRelationship ||
                  entry.relationship ||
                  entry.name;

                // Capitalize first letter
                displayName =
                  displayName.charAt(0).toUpperCase() + displayName.slice(1);

                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    ></span>
                    <span className="capitalize">{displayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-5">
          {summaryData.length === 0 ? (
            <p className="text-gray-500 text-center text-sm">
              No estate distribution data available.
            </p>
          ) : (
            summaryData.map((person, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b border-gray-100 pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={person.image}
                    alt={person.name}
                    loading="lazy"
                    decoding="async"
                    className="w-12 h-12 rounded-full bg-gray-50 object-contain"
                  />
                  <div>
                    <p className="text-base font-semibold text-gray-900 capitalize">
                      {person.heir_type?.replace(/_/g, " ")}
                    </p>

                    <p className="text-sm text-gray-500">
                      {person.name || "Name"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {person.status === "alive" && person.value ? (
                    <p className="text-sm font-medium text-primary">
                      {person.value}%
                    </p>
                  ) : (
                    <div className="h-[20px]" />
                  )}

                  {person.relationship === "you" &&
                  person.status === "deceased" ? (
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span className="w-2.5 h-2.5 bg-yellow rounded-full mr-2"></span>
                      You are Sharing
                    </div>
                  ) : person.status === "deceased" ? (
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span className="w-2.5 h-2.5 bg-secondary rounded-full mr-2"></span>
                      Deceased
                    </div>
                  ) : (
                    <div className="flex items-center text-primary font-medium text-sm">
                      <span className="w-2.5 h-2.5 bg-[#06AD06] rounded-full mr-2"></span>
                      Alive
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <StyledButton
            name={
              <>
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </>
            }
            className="w-full"
            onClick={handleAddMember}
          />
        </div>

        <h3 className="text-xl font-medium text-primary mt-5 mb-1">
          Export & Support
        </h3>
        <div className="mt-8 space-y-3">
          <StyledButton
            name={
              isDownloading ? (
                <>Generating...</>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF Report
                </>
              )
            }
            className="w-full"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          />
          <StyledButton
            name={
              <>
                <Users className="w-4 h-4 mr-2" />
                Book Expert Consultation
              </>
            }
            variant="quaternary"
            className="w-full "
            onClick={() => setIsDialogOpen(true)}
          />
        </div>
        <div className="mt-6 text-xs text-secondary border border-black/10 p-4">
          <p>
            Disclaimer: This visualization is for informational purposes only
            and not a substitute for legal advice. Consult a qualified legal
            professional for personalized guidance.
          </p>
        </div>
      </div>

      <Suspense fallback={null}>
        {isDialogOpen && (
          <RequestDialog
            open={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            title="Book Expert Consultation"
            schedule={true}
            request={false}
          />
        )}
      </Suspense>
    </div>
  );
};

export default SuccessionOverviewDrawer;
