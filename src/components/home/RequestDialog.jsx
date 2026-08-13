import { useEffect, useState } from "react";
import { createEnquiry } from "../../api/enquiryApi";
import AnimatedPopup from "../../ui/AnimatedPopup";
import PhoneInputField from "../../ui/PhoneInputField";

const RequestDialog = ({
  open,
  title = "",
  isSchedule = false,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  return (
    <AnimatedPopup open={open} onClose={onClose} size="md">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-[Urania] text-[20px] md:text-[22px] font-semibold">
            {title}
          </h3>
          <p className="mt-1 text-[13px] text-[#5A7371]">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>

        {/* Form */}
        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setSuccess("");

            const form = e.currentTarget;
            const fullName = form.fullName.value.trim();
            const email = form.email.value.trim();
            const phone = form.phone.value.trim();
            const message = form.message.value.trim();
            const date = form.date?.value || "";
            const time = form.time?.value || "";

            // Basic validation
            if (!fullName) return setError("Full Name is required.");
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
              return setError("Please enter a valid email address.");
            if (isSchedule) {
              if (!date) return setError("Preferred Date is required.");
              if (!time) return setError("Preferred Time is required.");
            }

            // Format date to DD-MM-YYYY
            const formatDate = (iso) => {
              const [y, m, d] = iso.split("-");
              return `${d}-${m}-${y}`;
            };
            // Format 24h time to 12h AM/PM
            const formatTime = (t) => {
              const [hh, mm] = t.split(":");
              let H = parseInt(hh, 10);
              const ampm = H >= 12 ? "PM" : "AM";
              H = H % 12 || 12;
              return `${String(H).padStart(2, "0")}:${mm} ${ampm}`;
            };

            const payload = {
              name: fullName,
              email,
              phone,
              message: message && message.trim() ? message.trim() : "No additional notes provided", // Default message if empty
              source: isSchedule ? "Schedule Expert Session" : "Request Call Back",
              type: "call",
              date: isSchedule && date ? formatDate(date) : undefined,
              time: isSchedule && time ? formatTime(time) : undefined,
            };

            // Debug: Log the payload being sent
            console.log('📤 Sending payload:', payload);

            try {
              setLoading(true);
              await createEnquiry(payload);
              setSuccess("Request submitted successfully.");
              form.reset();
              // Small delay to show success then close
              setTimeout(() => {
                onClose?.();
              }, 400);
            } catch (err) {
              console.error('❌ Error response:', err);
              setError(typeof err === "string" ? err : "Submission failed. Please try again.");
            } finally {
              setLoading(false);
            }
          }}
        >
          {error && (
            <div className="text-[13px] text-red-600">{error}</div>
          )}
          {success && (
            <div className="text-[13px] text-green-600">{success}</div>
          )}

          <div>
            <label className="block text-[14px] mb-1">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              placeholder="John Doe"
              className="w-full h-10 rounded-md border border-[#E5E7EB] bg-[#F7F8F8] px-3 text-[14px]"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] mb-1">Email Address <span className="text-red-500">*</span></label>
            <input
              type="email"
              name="email"
              placeholder="John@test.com"
              className="w-full h-10 rounded-md border border-[#E5E7EB] bg-[#F7F8F8] px-3 text-[14px]"
              required
            />
          </div>

          <div>
            <label className="block text-[14px] mb-1">Phone Number</label>
            <PhoneInputField
              name="phone"
              variant="light"
              placeholder="Enter phone number"
            />
          </div>

          {isSchedule && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] mb-1">Preferred Date <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  name="date"
                  className="w-full h-10 rounded-md border border-[#E5E7EB] bg-[#F7F8F8] px-3 text-[14px]"
                  required={isSchedule}
                />
              </div>
              <div>
                <label className="block text-[14px] mb-1">Preferred Time <span className="text-red-500">*</span></label>
                <input
                  type="time"
                  name="time"
                  className="w-full h-10 rounded-md border border-[#E5E7EB] bg-[#F7F8F8] px-3 text-[14px]"
                  required={isSchedule}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[14px] mb-1">Additional Notes (Optional)</label>
            <textarea
              rows="3"
              name="message"
              placeholder="Please provide any additional details about your request..."
              className="w-full rounded-md border border-[#E5E7EB] bg-[#F7F8F8] px-3 py-2 text-[14px]"
            />
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              className="h-10 px-4 rounded-full bg-[#F2F4F5] text-[14px]"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 px-5 rounded-full bg-[#132F2C] text-white text-[14px] disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
    </AnimatedPopup>
  );
};

export default RequestDialog;
