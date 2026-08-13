// Test script for tree capture - Run this in browser console
import { generateTreeBase64 } from './tree/generateTreeBase64.js';

// Test function to verify tree capture
export const testTreeCapture = async () => {
  console.log('🔍 Testing tree capture...');
  
  try {
    // Check if tree element exists
    const treeElement = document.getElementById('tree');
    if (!treeElement) {
      console.error('❌ Tree element not found');
      return false;
    }
    console.log('✅ Tree element found:', treeElement);
    
    // Test dimensions
    console.log('📏 Tree dimensions:', {
      width: treeElement.scrollWidth,
      height: treeElement.scrollHeight,
      offsetWidth: treeElement.offsetWidth,
      offsetHeight: treeElement.offsetHeight
    });
    
    // Generate base64 image
    console.log('📸 Generating tree image...');
    const base64Image = await generateTreeBase64();
    
    if (base64Image && base64Image.startsWith('data:image/png;base64,')) {
      console.log('✅ Tree image generated successfully!');
      console.log('📊 Image size:', Math.round(base64Image.length * 0.75 / 1024), 'KB');
      
      // Create preview
      const img = new Image();
      img.src = base64Image;
      img.style.maxWidth = '300px';
      img.style.border = '2px solid green';
      document.body.appendChild(img);
      
      return base64Image;
    } else {
      console.error('❌ Invalid image format');
      return false;
    }
  } catch (error) {
    console.error('❌ Tree capture failed:', error);
    return false;
  }
};

// Auto-run test if in browser
if (typeof window !== 'undefined') {
  window.testTreeCapture = testTreeCapture;
  console.log('🧪 Test function available: window.testTreeCapture()');
}
