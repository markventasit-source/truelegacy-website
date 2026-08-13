import { useState, lazy, Suspense } from "react";
import { X, Trash, Check, Pencil } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSuccession } from "../../context/SuccessionContext";
import StyledButton from "../../ui/StyledButton";
import { removeMember, updateMember } from "../../api/successionApi";
import { getMemberImage } from "../../utils/getMemberImage";
import { toast } from "sonner";

// Lazy-load the heavy recharts-based component; render only when visible
const EstateShareChart = lazy(() => import("../../components/succession/EstateShare"));

const SuccessionFamilyView = () => {
  const { successionData, setSuccessionData } = useSuccession();
  const [selectedMember, setSelectedMember] = useState(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const tree = successionData?.survey?.family_tree;

  if (!tree) {
    return (
      <div className="text-center mt-10 text-gray-600">
        No family data found. Please complete the succession form first.
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

  // Format heir_type for display based on user's gender
  const formatHeirType = (heirType) => {
    if (!heirType) return "";
    
    const userGender = tree.gender?.toLowerCase();
    let formatted = heirType.replace(/_/g, " ");
    
    // If user is female, replace "wife_" with "your_"
    if (userGender === "female" && formatted.startsWith("wife ")) {
      formatted = formatted.replace("wife ", "your ");
    }
    // If user is male, replace "husband_" or "husbands_" with "your_"
    else if (userGender === "male" && (formatted.startsWith("husband ") || formatted.startsWith("husbands "))) {
      formatted = formatted.replace(/^husbands? /, "your ");
    }
    
    return formatted;
  };

  const handleSaveName = async () => {
    if (!updatedName.trim() || updatedName === selectedMember.name) {
      setIsEditingName(false);
      return;
    }

    try {
      setIsSaving(true);
      const payload = {
        member_id: selectedMember.id,
        name: updatedName,
      };
      const res = await updateMember(successionData?.survey?.id, payload);

      const updatedData = {
        ...successionData,
        survey: {
          ...successionData.survey,
          family_tree:
            res.data.family_tree || successionData?.survey?.family_tree,
        },
      };
      setSuccessionData(updatedData);
      setIsEditingName(false);
      toast.success(res.message || "Member name updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update member name");
    } finally {
      setIsSaving(false);
    }
  };
  const handleRemoveMember = async () => {
    if (!selectedMember || isSaving) return;

    setShowDeletePopup(false);

    try {
      setIsSaving(true);

      const payload = {
        member_id: selectedMember.id,
      };

      const res = await removeMember(successionData?.survey?.id, payload);

      const updatedData = {
        ...successionData,
        survey: {
          ...successionData.survey,
          family_tree:
            res.data.family_tree || successionData?.survey?.family_tree,
        },
      };

      setSuccessionData(updatedData);
      toast.success(res.message || "Member removed successfully");
      
      // Close drawer after successful deletion
      setTimeout(() => {
        setSelectedMember(null);
      }, 100);
    } catch (error) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = () => {
    if (isSaving || showDeletePopup) return;
    setShowDeletePopup(true);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white px-4 sm:px-8 lg:px-16 xl:px-[64px] py-6 gap-6 relative">
      <div className="w-full md:w-1/2 border-b md:border-b-0 md:border-r border-gray-200 p-4 sm:p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-medium text-primary">
            Family Members
          </h2>
          <span className="text-gray-400 text-sm sm:text-lg">
            ({members.length})
          </span>
        </div>

        <div className="space-y-3">
          {members.map((member, index) => {
            const imgSrc = getMemberImage(member.relationship, member.gender);
            const isDeceased = member.living_status === "deceased";
            const isSelected = selectedMember?.id === member.id;

            return (
              <div
                key={member.id || index}
                onClick={() => {
                  setSelectedMember(member);
                  setIsEditingName(false);
                  setUpdatedName(member.name || "");
                }}
                className={`flex justify-between items-center bg-white hover:bg-gray-50 cursor-pointer border-b border-gray-100 py-3 sm:py-4 px-2 rounded transition ${
                  isSelected ? "ring-2 ring-[#F4D57E]/40" : ""
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <img
                    src={imgSrc}
                    alt={member.name}
                    loading="lazy"
                    className="w-12 h-12 sm:w-15 sm:h-15 rounded-full border border-gray-200 object-contain"
                  />
                  <div>
                    <h4 className="text-base sm:text-lg font-medium text-green">
                      {member.name || "Unnamed"}
                    </h4>
                    <p className="text-sm sm:text-lg text-secondary font-medium capitalize">
                      {formatHeirType(member.heir_type)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end min-w-[72px]">
                  {member.relationship === "you" && isDeceased ? (
                    <p className="text-sm sm:text-base text-green flex items-center gap-1">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow rounded-full"></span>
                      You are Sharing
                    </p>
                  ) : isDeceased ? (
                    <p className="text-sm sm:text-base text-green flex items-center gap-1">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 bg-secondary rounded-full"></span>
                      Deceased
                    </p>
                  ) : (
                    <>
                      {member.share_percent ? (
                        <p className="text-sm sm:text-base font-medium text-green">
                          {member.share_percent?.toFixed(2)}%
                        </p>
                      ) : null}

                      <p className="text-sm sm:text-base text-green font-medium flex items-center gap-1">
                        <span className="w-3 h-3 sm:w-4 sm:h-4 bg-[#3FA270] rounded-full"></span>
                        Alive
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Right Panel */}
      <div className="hidden md:block w-1/2 p-6 overflow-y-auto relative">
        {!selectedMember ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-center">
            Select a member to view details
          </div>
        ) : (
          <MemberDetailView
            selectedMember={selectedMember}
            setSelectedMember={setSelectedMember}
            isEditingName={isEditingName}
            setIsEditingName={setIsEditingName}
            updatedName={updatedName}
            setUpdatedName={setUpdatedName}
            handleSaveName={handleSaveName}
            isSaving={isSaving}
            confirmDelete={confirmDelete}
            showDeletePopup={showDeletePopup}
          />
        )}
      </div>
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/40 z-[90] md:hidden"
              onClick={() => setSelectedMember(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full bg-white rounded-t-2xl shadow-xl p-6 z-[100] max-h-[90vh] overflow-y-auto md:hidden"
            >
              <MemberDetailView
                selectedMember={selectedMember}
                setSelectedMember={setSelectedMember}
                isEditingName={isEditingName}
                setIsEditingName={setIsEditingName}
                updatedName={updatedName}
                setUpdatedName={setUpdatedName}
                handleSaveName={handleSaveName}
                isSaving={isSaving}
                confirmDelete={confirmDelete}
                showDeletePopup={showDeletePopup}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[110]">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Remove Member?
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this member from your succession
              plan? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-3">
              <StyledButton
                onClick={() => {
                  if (!isSaving) {
                    setShowDeletePopup(false);
                  }
                }}
                name="Cancel"
                variant="quinary"
                disabled={isSaving}
              />
              <StyledButton
                name={isSaving ? "Removing..." : "Yes, Remove"}
                onClick={() => {
                  if (!isSaving) {
                    handleRemoveMember();
                  }
                }}
                disabled={isSaving}
                className="bg-[#FF2121] text-white hover:bg-red-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MemberDetailView = ({
  selectedMember,
  setSelectedMember,
  isEditingName,
  setIsEditingName,
  updatedName,
  setUpdatedName,
  handleSaveName,
  confirmDelete,
  isSaving,
  showDeletePopup,
}) => (
  <div className="max-w-md mx-auto relative">
    <button
      onClick={() => setSelectedMember(null)}
      className="absolute top-0 right-0 text-gray-600 hover:text-black text-sm flex items-center gap-1"
    >
      Close <X className="w-4 h-4" />
    </button>

    <div className="flex flex-col items-center mb-6 mt-2">
      <img
        src={getMemberImage(selectedMember.relationship, selectedMember.gender)}
        alt={selectedMember.relationship}
        className="w-20 h-20 sm:w-25 sm:h-25 rounded-full object-contain"
        loading="lazy"
        decoding="async"
        />

      <div className="flex items-center justify-center gap-2 mt-3">
        {isEditingName ? (
          <>
            <input
              type="text"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              autoFocus
              className="border border-gray-300 rounded px-2 py-[2px] text-sm text-primary font-medium focus:outline-none focus:ring-1 focus:ring-[#034909]"
            />
            {isSaving ? (
              <span className="text-xs text-gray-400">Saving...</span>
            ) : (
              <Check
                className="w-4 h-4 text-green-600 cursor-pointer"
                onClick={handleSaveName}
              />
            )}
          </>
        ) : (
          <>
            <h3 className="text-lg sm:text-xl font-medium capitalize text-primary">
              {updatedName || "Unnamed"}
            </h3>
            <Pencil
              className="w-4 h-4 text-gray-500 hover:text-[#034909] cursor-pointer"
              onClick={() => setIsEditingName(true)}
            />
          </>
        )}
      </div>

      <p className="text-base sm:text-lg font-medium capitalize text-secondary">
        {selectedMember.relationship}
      </p>
    </div>

    <div className="space-y-4">
      <div className="space-y-3 bg-[#F1F4FF] p-4 rounded-[4px] border border-[#B3C3FF]/15 mb-4 sm:mb-6">
        <p className="text-sm sm:text-base text-primary font-medium capitalize">
          <span className="text-secondary">Relationship:</span>{" "}
          {selectedMember.relationship}
        </p>
        <p className="text-sm sm:text-base text-primary font-medium capitalize">
          <span className="text-secondary">Gender:</span>{" "}
          {selectedMember.gender
            ? selectedMember.gender.charAt(0).toUpperCase() +
              selectedMember.gender.slice(1)
            : "—"}
        </p>
        <p className="text-sm sm:text-base text-primary font-medium capitalize">
          <span className="text-secondary">Living Status:</span>{" "}
          {selectedMember.living_status
            ? selectedMember.living_status.charAt(0).toUpperCase() +
              selectedMember.living_status.slice(1)
            : "—"}
        </p>
      </div>

      <div className="bg-[#F4D57E]/20 p-4 rounded-[4px] mb-4 sm:mb-6 flex items-center">
        <Suspense fallback={null}>
          <EstateShareChart share_percent={selectedMember.share_percent || 0} />
        </Suspense>
        <div className="ml-4">
          <p className="text-base sm:text-lg text-secondary">Estate Share</p>
          <p className="text-lg sm:text-xl font-semibold text-primary">
            {selectedMember.share_percent?.toFixed(2) || 0}%
          </p>
        </div>
      </div>

      {selectedMember.relationship !== "you" && selectedMember.relationship !== "self" && (
        <div className="flex gap-3 mt-4">
          <StyledButton
            onClick={confirmDelete}
            name={
              <>
                <Trash className="w-4 h-4" />
                {isSaving ? "Removing..." : "Remove"}
              </>
            }
            disabled={isSaving || showDeletePopup}
            className="flex-1 bg-white text-[#FF2121] border border-[#FF2121] hover:bg-red-50 flex items-center justify-center gap-2"
          />
        </div>
      )}
    </div>
  </div>
);

export default SuccessionFamilyView;
