import { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { generateTreeBase64 } from '../../utils/tree/generateTreeBase64';
import { sendSuccessionTreeToBackend } from '../../api/whatsappApi';
import { useSuccession } from '../../context/SuccessionContext';
import StyledButton from '../../ui/StyledButton';
import PhoneInputField from '../../ui/PhoneInputField';
import '../../styles/dm-sans.css';

const WhatsAppShareModal = ({ successionId, onClose, preCapturedTreeImage }) => {
  const { successionData } = useSuccession();
  const [phone, setPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Close overview drawer when modal opens
  useEffect(() => {
    try {
      window.dispatchEvent(new CustomEvent("closeDrawers"));
    } catch {
      // no-op if event fails
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!phone.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    if (!userName.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!userEmail.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!validateEmail(userEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (!isValidPhoneNumber(formattedPhone)) {
      toast.error('Please enter a valid phone number');
      return;
    }

    if (!successionId) {
      toast.error('Succession ID is required');
      return;
    }

    setIsSubmitting(true);

    try {
      // Use pre-captured tree image first, otherwise generate new one
      let treeImage;
      
      if (preCapturedTreeImage) {
        console.log('📸 Using pre-captured tree image from tree view');
        treeImage = preCapturedTreeImage;
      } else if (successionData?.capturedTreeImage) {
        console.log('📸 Using pre-captured tree image from succession data');
        treeImage = successionData.capturedTreeImage;
      } else {
        console.log('📸 Generating new tree image');
        treeImage = await generateTreeBase64();
      }

      const payload = {
        successionId,
        name: userName.trim(),
        email: userEmail.trim(),
        phone: formattedPhone,
        treeImage,
        successionData,
      };

      await sendSuccessionTreeToBackend(payload);

      console.log('✅ WhatsApp API call successful, setting success state');
      setIsSuccess(true);
      setPhone('');
      setFormattedPhone('');
      setUserName('');
      setUserEmail('');
      
      // Close overview drawer automatically
      try {
        console.log('🔐 Closing overview drawer');
        window.dispatchEvent(new CustomEvent("closeDrawers"));
      } catch (error) {
        console.log('⚠️ Failed to close drawer:', error);
      }

      console.log('⏰ Setting timeout to close modal in 1.2 seconds');
      setTimeout(() => {
        console.log('🚪 Closing WhatsApp modal');
        onClose();
      }, 1200);
    } catch (error) {
      toast.error('Failed to send WhatsApp message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setPhone('');
      setFormattedPhone('');
      setUserName('');
      setUserEmail('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[360px] min-[420px]:max-w-[420px] md:max-w-lg mx-auto md:w-[500px] relative">
        {/* Close Button - Top Right Corner */}
        <button
          onClick={handleClose}
          disabled={isSubmitting}
          className="absolute top-2 right-4 p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10 border-none outline-none focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
        
        <div className="pt-6 px-2 pb-2">
          <div className="mb-2 pl-2 md:pl-0 md:ml-4">
            <p className="hidden md:block md:text-[18px] md:font-bold md:leading-[120%] md:tracking-normal font-[DM_Sans] text-gray-800">
              Do you want to know why your result came <br />this way?
            </p>
            <p className="md:hidden text-[16px] font-medium leading-[120%] tracking-[-0.54px] font-[DM_Sans] text-gray-800 align-middle">
              Do you want to know why your<br />result came this way?
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {isSuccess && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Report sent successfully.
            </div>
          )}
          <div className="mb-6">
            <label htmlFor="name" className="block font-[DM_Sans] font-normal text-[14px] leading-[14px] tracking-[0px] text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#F3F3F5' }}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block font-[DM_Sans] font-normal text-[14px] leading-[14px] tracking-[0px] text-gray-700 mb-2">
              Email 
            </label>
            <input
              type="email"
              id="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#F3F3F5' }}
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="phone" className="block font-[DM_Sans] font-normal text-[14px] leading-[14px] tracking-[0px] text-gray-700 mb-2">
              WhatsApp Number
            </label>
            <PhoneInputField
              id="phone"
              variant="light"
              placeholder="Enter WhatsApp number"
              value={phone}
              onChange={(formatted, raw) => {
                setFormattedPhone(formatted);
                setPhone(raw);
              }}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="flex gap-3 justify-center md:justify-between">
            <StyledButton
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              name={
                <span className="font-[Arial] font-normal text-[14px] leading-[20px] tracking-[0px]">
                  Cancel
                </span>
              }
              variant="quinary"
              minWidth="0px"
              className="w-[95px] min-[420px]:w-[110px] h-[40px] rounded-[8px] border border-[#E5E7EB] px-0 py-0 md:flex-1 md:w-auto md:h-auto md:border-0 md:px-5 md:py-3"
            />
            <StyledButton
              type="submit"
              disabled={isSubmitting}
              name={
                isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </div>
                ) : (
                  <span className="font-[Arial] font-normal text-[14px] leading-[20px] tracking-[0px]">
                    Request Detailed Report
                  </span>
                )
              }
              variant="primary"
              minWidth="0px"
              className="w-[188px] min-[420px]:w-[230px] h-[40px] rounded-[8px] px-0 py-0 md:flex-1 md:w-auto md:h-auto md:px-5 md:py-3"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppShareModal;
