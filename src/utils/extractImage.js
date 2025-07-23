export const extractFirstImageFromContent = (htmlContent) => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return null;
  }

  try {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Find the first img element
    const firstImg = tempDiv.querySelector('img');
    
    if (firstImg && firstImg.src) {
      return firstImg.src;
    }
    
    return null;
  } catch (error) {
    console.error('Error extracting image from content:', error);
    return null;
  }
};
export const extractTextFromContent = (htmlContent, maxLength = 150) => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  try {
    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get text content and clean it up
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    // Trim and limit length
    const trimmedText = textContent.trim();
    
    if (trimmedText.length <= maxLength) {
      return trimmedText;
    }
    
    // Cut at word boundary
    const truncated = trimmedText.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    return lastSpaceIndex > 0 
      ? truncated.substring(0, lastSpaceIndex) + '...'
      : truncated + '...';
      
  } catch (error) {
    console.error('Error extracting text from content:', error);
    return '';
  }
};