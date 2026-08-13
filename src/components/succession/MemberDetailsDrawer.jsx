import { useState, useEffect } from "react";
import { X, Pencil, Trash, Check } from "lucide-react";
import StyledButton from "../../ui/StyledButton";
import EstateShareChart from "./EstateShare";
import { removeMember, updateMember } from "../../api/successionApi";
import { useSuccession } from "../../context/SuccessionContext";
import { getMemberImage } from "../../utils/getMemberImage";
import { toast } from "sonner";

const MemberDetailsDrawer = ({ open, onClose, member }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedName, setUpdatedName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const { successionData, setSuccessionData } = useSuccession();

  useEffect(() => {
    if (member?.name) {
      setUpdatedName(member.name);
    } else {
      setUpdatedName("");
    }
  }, [member]);

  if (!open || !member) return null;

  const {
    id,
    relationship,
    gender = "male",
    living_status = "alive",
    share_percent = 25,
    aggregatedMembers = [],
    isAggregatedGroup = false,
  } = member;

  const imgSrc = getMemberImage(relationship, gender);

  // Check if this is an aggregated group with multiple members
  const hasMultipleMembers = isAggregatedGroup && aggregatedMembers.length > 0;

  // Calculate total share for all members in the drawer
  const totalShare = hasMultipleMembers
    ? aggregatedMembers.reduce((sum, m) => sum + (m.share_percent || 0), 0)
    : share_percent;

  const handleSaveName = async () => {
    if (!updatedName.trim() || updatedName === member.name) {
      setIsEditing(false);
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        member_id: member.id,
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
      setIsEditing(false);
      toast.success(res.message || "Member name updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update member name");
    } finally {
      setIsSaving(false);
    }
  };
  const handleRemoveMember = async () => {
    if (isSaving) return; // Prevent double execution

    setShowDeletePopup(false);

    try {
      setIsSaving(true);

      const payload = {
        member_id: memberToDelete,
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
      setIsEditing(false);
      toast.success(res.message || "Member removed successfully");

      // Close drawer after successful deletion
      setTimeout(() => {
        onClose();
      }, 100);
    } catch (error) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsSaving(false);
      setMemberToDelete(null);
    }
  };

  const handleRemoveIndividualMember = async () => {
    if (isSaving) return; // Prevent double execution

    setShowDeletePopup(false);

    try {
      setIsSaving(true);
      const payload = { member_id: memberToDelete };
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

      // Update the aggregatedMembers in the current member object
      const updatedAggregatedMembers = aggregatedMembers.filter(
        (m) => m.id !== memberToDelete
      );

      // If no members left, close the drawer
      if (updatedAggregatedMembers.length === 0) {
        setTimeout(() => {
          onClose();
        }, 100);
      }

      toast.success(res.message || "Member removed successfully");
    } catch (error) {
      toast.error(error.message || "Failed to remove member");
    } finally {
      setIsSaving(false);
      setMemberToDelete(null);
    }
  };

  const confirmDelete = (memberId, isIndividual = false) => {
    if (isSaving || showDeletePopup) return; // Prevent opening multiple popups
    setMemberToDelete(memberId);
    setShowDeletePopup(true);
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex justify-end transition-opacity ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full sm:w-[450px] bg-white h-[80vh] shadow-xl p-4 sm:p-6 overflow-y-auto">
        <div className="flex justify-end items-center mb-4 sm:mb-6">
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black flex items-center gap-1"
          >
            Close <X className="w-4 h-4" />
          </button>
        </div>

        {hasMultipleMembers ? (
          // Multiple members view
          <>
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              {aggregatedMembers.map((individualMember) => {
                const memberImgSrc = getMemberImage(
                  individualMember.relationship,
                  individualMember.gender
                );
                const isEditingThis = editingMemberId === individualMember.id;

                return (
                  <div
                    key={individualMember.id}
                    className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-1">
                      <img
                        src={memberImgSrc}
                        alt={individualMember.relationship}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-contain"
                        loading="lazy"
                        decoding="async"
                        />
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-medium text-gray-800 capitalize">
                          {individualMember.relationship}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {individualMember.name || "Name"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl font-bold text-gray-800">
                        {individualMember.share_percent?.toFixed(2) || 0}%
                      </span>
                      <button
                        onClick={() => confirmDelete(individualMember.id, true)}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSaving || showDeletePopup}
                      >
                        <Trash className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Estate Share Summary */}
            <div className="bg-[#FFF9E6] p-4 sm:p-6 rounded-2xl flex items-center gap-3 sm:gap-4 border border-[#F4D57E]">
              <EstateShareChart share_percent={totalShare} />
              <div>
                <p className="text-xs sm:text-sm text-gray-600 mb-1">
                  Estate Share
                </p>
                <p className="text-3xl sm:text-4xl font-bold text-gray-800">
                  {totalShare?.toFixed(0) || 0}%
                </p>
              </div>
            </div>
          </>
        ) : (
          // Single member view
          <>
            <div className="flex flex-col items-center mb-4 sm:mb-6">
              <img
                src={imgSrc}
                alt={relationship}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-contain"
                loading="lazy"
                decoding="async"
                />
              <h3 className="mt-2 sm:mt-3 text-lg sm:text-xl font-medium capitalize text-primary flex items-center gap-2">
                {relationship}
              </h3>

              <div className="flex items-center gap-2 mt-1">
                {isEditing ? (
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
                    <h3 className="text-lg font-medium capitalize text-secondary">
                      {updatedName || "Unnamed"}
                    </h3>
                    <Pencil
                      className="w-4 h-4 text-gray-500 hover:text-[#034909] cursor-pointer"
                      onClick={() => setIsEditing(true)}
                    />
                  </>
                )}
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4 bg-[#F1F4FF] p-3 sm:p-4 rounded-[4px] border border-[#B3C3FF]/15 mb-4 sm:mb-6">
              <p className="text-sm sm:text-base text-primary font-medium capitalize">
                <span className="text-secondary">Relationship: </span>
                {relationship || "—"}
              </p>
              <p className="text-sm sm:text-base text-primary font-medium capitalize">
                <span className="text-secondary">Gender: </span>
                {gender.charAt(0).toUpperCase() + gender.slice(1)}
              </p>
              <p className="text-sm sm:text-base text-primary font-medium capitalize">
                <span className="text-secondary">Living Status: </span>
                {living_status.charAt(0).toUpperCase() + living_status.slice(1)}
              </p>
            </div>

            <div className="bg-[#F4D57E]/20 p-3 sm:p-4 rounded-[4px] mb-4 sm:mb-6 flex items-center">
              <EstateShareChart share_percent={share_percent} />
              <div className="ml-3 sm:ml-4">
                <p className="text-base sm:text-lg text-secondary">
                  Estate Share
                </p>
                <p className="text-lg sm:text-xl font-semibold text-primary">
                  {share_percent}%
                </p>
              </div>
            </div>

            {relationship !== "you" && relationship !== "self" && (
              <div className="flex justify-center">
                <StyledButton
                  name={
                    <>
                      <Trash className="w-4 h-4" />
                      {isSaving ? "Removing..." : "Remove Member"}
                    </>
                  }
                  onClick={() => confirmDelete(member.id, false)}
                  disabled={isSaving || showDeletePopup}
                  className="flex-1 bg-white text-[#FF2121] border border-[#FF2121] hover:bg-red-50 flex items-center justify-center gap-2"
                />
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]">
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
                    setMemberToDelete(null);
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
                    hasMultipleMembers
                      ? handleRemoveIndividualMember()
                      : handleRemoveMember();
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

export default MemberDetailsDrawer;
