import { useEffect, useState, useMemo } from "react";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import StyledButton from "../../ui/StyledButton";
import StyledSelectField from "../../ui/StyledSelectField";
import InputField from "../../ui/InputField";
import placeholderImg from "../../assets/icon/accent-mark.webp";
const sonImg = placeholderImg;
const daughterImg = placeholderImg;
const fatherImg = placeholderImg;
const motherImg = placeholderImg;
const brotherImg = placeholderImg;
const sisterImg = placeholderImg;
const maleImg = placeholderImg;
const femaleImg = placeholderImg;
import { addMember } from "../../api/successionApi";
import { useSuccession } from "../../context/SuccessionContext";
import { toast } from "sonner";

const AddChildDrawer = ({ open, onClose }) => {
  const { successionData, setSuccessionData } = useSuccession();
  const [loading, setLoading] = useState(false);

  // Get user's gender and existing family members
  const userGender = successionData?.survey?.family_tree?.gender || "male";
  const familyTree = successionData?.survey?.family_tree || {};
  const existingParents = familyTree.parents || [];
  const existingSpouse = familyTree.spouse;

  // Check which family members already exist
  const hasFather = existingParents.some((p) => p.relationship === "father");
  const hasMother = existingParents.some((p) => p.relationship === "mother");
  const hasSpouse = existingSpouse && existingSpouse.name;

  // Build available relationship options
  const relationshipOptions = useMemo(() => {
    const options = [
      { label: "Son", value: "son" },
      { label: "Daughter", value: "daughter" },
    ];

    if (!hasFather) {
      options.push({ label: "Father", value: "father" });
    }
    if (!hasMother) {
      options.push({ label: "Mother", value: "mother" });
    }

    options.push({ label: "Brother", value: "brother" });
    options.push({ label: "Sister", value: "sister" });

    if (!hasSpouse) {
      if (userGender === "female") {
        options.push({ label: "Husband", value: "husband" });
      } else {
        options.push({ label: "Wife", value: "wife" });
      }
    }

    return options;
  }, [hasFather, hasMother, hasSpouse, userGender]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      relationship: relationshipOptions[0]?.value || "son",
      name: "",
    },
  });

  const relationship = watch("relationship");
  const [selectedImage, setSelectedImage] = useState(sonImg);

  // Update image based on relationship
  useEffect(() => {
    const imageMap = {
      son: sonImg,
      daughter: daughterImg,
      father: fatherImg,
      mother: motherImg,
      brother: brotherImg,
      sister: sisterImg,
      wife: femaleImg,
      husband: maleImg,
    };
    setSelectedImage(imageMap[relationship] || sonImg);
  }, [relationship]);
  // Reset form when drawer opens with first available option
  useEffect(() => {
    if (open && relationshipOptions.length > 0) {
      reset({
        relationship: relationshipOptions[0].value,
        name: "",
      });
    }
  }, [open, relationshipOptions, reset]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [open]);

  if (!open) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await addMember(successionData?.survey?.id, data);
      const updatedData = {
        ...successionData,
        survey: {
          ...successionData.survey,
          family_tree:
            res.data.family_tree || successionData?.survey?.family_tree,
        },
      };
      setSuccessionData(updatedData);
      toast.success(res.message || "Member added successfully");
    } catch (error) {
      toast.error(error.message || "Failed to add member");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div
      className={`absolute inset-0 z-50 flex justify-end transition-opacity  ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full sm:w-[450px] bg-white h-[80vh] shadow-xl p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-medium text-primary">
            Add Family Member
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black flex items-center gap-1"
          >
            Close <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-base text-secondary mb-6">
          Enter details to add a new family member
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex justify-center mb-4">
            <img
              src={selectedImage}
              alt={relationship}
              className="w-20 h-20 rounded-full object-contain border border-gray-200 bg-white"
              loading="lazy"
              decoding="async"
              />
          </div>

          <StyledSelectField
            label="Relationship"
            {...register("relationship", {
              required: "Relationship is required",
            })}
            options={relationshipOptions}
          />
          {errors.relationship && (
            <p className="text-red-500 text-xs">
              {errors.relationship.message}
            </p>
          )}

          <InputField
            label="Name"
            placeholder="Enter Name"
            {...register("name", {
              required: "Name is required",
            })}
            className="border-[0.8px] border-black/15 rounded-md"
          />
          {errors.name && (
            <p className="text-red-500 text-xs">{errors.name.message}</p>
          )}

          <div className="pt-4">
            <StyledButton
              name={loading ? "Adding..." : "Add Member"}
              variant="primary"
              className="w-full bg-[#F4D57E] text-[#15302D] hover:bg-[#e3c16d]"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddChildDrawer;
