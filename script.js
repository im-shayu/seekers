// Function to update hero elements visibility
function updateHeroElements() {
  const scrollY = window.scrollY;
  const heroSection = document.querySelector('.hero');
  const heroHeight = heroSection ? heroSection.offsetHeight : 0;

  // Logo overlay effect
  const logoOverlay = document.querySelector('.hero-logo-overlay');
  const heroTagline = document.querySelector('.hero-tagline');
  if (logoOverlay && heroTagline && heroHeight > 0) {
    const start = 0;
    const end = heroHeight * 0.1;
    const taglineStart = heroHeight * 0.30; // Tagline starts appearing at 30%
    const taglineEnd = heroHeight * 0.35;   // Tagline fully visible at 35%
    let progress = 0;
    let taglineProgress = 0;
    
    // Check if mobile view (screen width <= 768px)
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // On mobile, show logo and tagline immediately
      progress = 1;
      taglineProgress = 1;
    } else {
      // Desktop scroll effects
      if (scrollY > start) {
        progress = (scrollY - start) / (end - start);
        if (progress > 1) progress = 1;
      }
      if (scrollY > taglineStart) {
        taglineProgress = (scrollY - taglineStart) / (taglineEnd - taglineStart);
        if (taglineProgress > 1) taglineProgress = 1;
      }
    }
    
    logoOverlay.style.opacity = progress;
    heroTagline.style.opacity = taglineProgress;
  }
}

// Initial setup - run immediately when page loads
updateHeroElements();

// Scroll effects for hero section
window.addEventListener('scroll', function() {
  updateHeroElements();
  
  // Scroll indicator visibility
  const scrollIndicator = document.querySelector('.scroll-indicator');
  if (scrollIndicator) {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Hide when user is at the bottom (within 100px of bottom)
    if (scrollTop + windowHeight >= documentHeight - 100) {
      scrollIndicator.style.opacity = '0';
    } else {
      scrollIndicator.style.opacity = '1';
    }
  }
});

// Three card animation system
const cards = document.querySelectorAll('.card');

function startCardAnimation() {
  if (cards.length === 0) {
    console.log('No cards found!');
    return;
  }
  
  console.log('Starting 3-card animation');
  animateCards();
}

function animateCards() {
  // Reset all cards to initial position (left side)
  cards.forEach(card => {
    card.className = 'card reset';
  });
  
  // Slide in all cards together
  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('reset');
      card.classList.add('sliding-in');
    });
    console.log('Cards sliding in');
  }, 500);
  
  // Flip cards one by one
  setTimeout(() => {
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.remove('sliding-in');
        card.classList.add('flipping');
        console.log(`Card ${index + 1} flipping`);
      }, index * 800);
    });
  }, 2000);
  
  // Slide out all cards together (after 10 seconds of being flipped)
  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('flipping');
      card.classList.add('sliding-out');
    });
    console.log('Cards sliding out');
  }, 12000);
  
  // Reset to left side before restarting (instant, invisible)
  setTimeout(() => {
    cards.forEach(card => {
      card.classList.remove('sliding-out');
      card.classList.add('reset');
    });
    console.log('Cards reset to left side');
    
    // Restart animation immediately after reset
    setTimeout(() => {
      console.log('Restarting animation');
      animateCards();
    }, 100);
  }, 13500);
}

// Initialize card animation
if (cards.length > 0) {
  console.log('Found', cards.length, 'cards, starting animation');
  startCardAnimation();
} else {
  console.log('No cards found!');
}

// Email Signup Popup
const emailPopup = document.getElementById('emailPopup');
const closePopup = document.getElementById('closePopup');
const alphaSignupButtons = document.querySelectorAll('.signup-btn');
const popupOverlay = document.getElementById('popupOverlay');
const popupEmailForm = document.getElementById('popupEmailForm');
const popupSuccess = document.getElementById('popupSuccess');

function showEmailPopup() {
  emailPopup.classList.add('show');
  if (popupOverlay) popupOverlay.classList.add('active');
  document.body.classList.add('popup-open');
}
function hideEmailPopup() {
  emailPopup.classList.remove('show');
  if (popupOverlay) popupOverlay.classList.remove('active');
  document.body.classList.remove('popup-open');
  // Reset form and success state for next open
  if (popupEmailForm && popupSuccess) {
    popupEmailForm.style.display = 'flex'; // Explicitly restore flex layout
    popupSuccess.style.display = 'none';
    popupEmailForm.reset();
    
    // Reset the submit button state
    const submitButton = popupEmailForm.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.textContent = 'Sign Up';
      submitButton.disabled = false;
    }
    
    var promo = document.getElementById('signupPromo');
    if (promo) promo.style.display = '';
  }
}

setTimeout(() => {
  if (!localStorage.getItem('alphaSignupClicked')) {
    showEmailPopup();
  }
}, 30000);

closePopup.addEventListener('click', hideEmailPopup);
if (alphaSignupButtons.length > 0) {
  alphaSignupButtons.forEach(button => {
    button.addEventListener('click', () => {
      showEmailPopup();
      localStorage.setItem('alphaSignupClicked', 'true');
    });
  });
}
if (popupOverlay) {
  popupOverlay.addEventListener('click', hideEmailPopup);
}

// Google Sheets integration
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby_2cwnI3FRLpgJZVizy8qZH-cgpeHCnDHuuMa3LLKcuaT6pEOGmF9DfUjNoF0MSMpLXg/exec';

// Alternative submission methods for better compatibility
async function submitEmailToGoogleSheetsFormData(email) {
  try {
    console.log('Attempting to submit email using FormData:', email);
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('source', 'Seekers Website');
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      body: formData
    });

    console.log('FormData Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.text();
    console.log('FormData Response result:', result);
    
    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.log('Could not parse JSON, returning raw text');
      return { success: true, message: 'Email submitted successfully' };
    }
  } catch (error) {
    console.error('FormData submission error:', error);
    return { success: false, message: 'Network error: ' + error.message };
  }
}

async function submitEmailToGoogleSheetsGET(email) {
  try {
    console.log('Attempting to submit email using GET method:', email);
    
    const params = new URLSearchParams({
      email: email,
      source: 'Seekers Website'
    });
    
    const url = `${GOOGLE_APPS_SCRIPT_URL}?${params.toString()}`;
    console.log('GET URL:', url);
    
    const response = await fetch(url, {
      method: 'GET'
    });

    console.log('GET Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.text();
    console.log('GET Response result:', result);
    
    // Try to parse JSON response
    try {
      const jsonResult = JSON.parse(result);
      return jsonResult; // Return the actual response from the server
    } catch (parseError) {
      // If it's not JSON, check if it's the test message
      if (result.includes('Email submission endpoint is working!')) {
        return { success: false, message: 'GET method not properly configured for email submission' };
      }
      return { success: true, message: 'Email submitted successfully via GET' };
    }
  } catch (error) {
    console.error('GET submission error:', error);
    return { success: false, message: 'Network error: ' + error.message };
  }
}

function submitEmailToGoogleSheetsXHR(email) {
  return new Promise((resolve) => {
    console.log('Attempting to submit email using XMLHttpRequest:', email);
    
    const xhr = new XMLHttpRequest();
    xhr.open('POST', GOOGLE_APPS_SCRIPT_URL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        console.log('XHR Response status:', xhr.status);
        console.log('XHR Response text:', xhr.responseText);
        
        if (xhr.status === 200) {
          try {
            const result = JSON.parse(xhr.responseText);
            resolve(result);
          } catch (parseError) {
            resolve({ success: true, message: 'Email submitted successfully' });
          }
        } else {
          resolve({ success: false, message: `HTTP error! status: ${xhr.status}` });
        }
      }
    };
    
    xhr.onerror = function() {
      console.error('XHR error occurred');
      resolve({ success: false, message: 'Network error occurred' });
    };
    
    const data = JSON.stringify({
      email: email,
      source: 'Seekers Website'
    });
    
    xhr.send(data);
  });
}

async function submitEmailWithFallback(email) {
  console.log('Starting email submission with fallback methods...');
  
  // Try Method 1: JSON POST
  try {
    const result1 = await submitEmailToGoogleSheets(email);
    if (result1.success) {
      console.log('Method 1 (JSON POST) succeeded');
      return result1;
    }
  } catch (error) {
    console.log('Method 1 failed:', error);
  }
  
  // Try Method 2: FormData POST
  try {
    const result2 = await submitEmailToGoogleSheetsFormData(email);
    if (result2.success) {
      console.log('Method 2 (FormData POST) succeeded');
      return result2;
    }
  } catch (error) {
    console.log('Method 2 failed:', error);
  }
  
  // Try Method 3: GET request (this one is working)
  try {
    const result3 = await submitEmailToGoogleSheetsGET(email);
    if (result3.success) {
      console.log('Method 3 (GET) succeeded');
      return result3;
    }
  } catch (error) {
    console.log('Method 3 failed:', error);
  }
  
  // Only try Method 4 if all others failed
  try {
    const result4 = await submitEmailToGoogleSheetsXHR(email);
    if (result4.success) {
      console.log('Method 4 (XMLHttpRequest) succeeded');
      return result4;
    }
  } catch (error) {
    console.log('Method 4 failed:', error);
  }
  
  console.log('All methods failed');
  return { success: false, message: 'All submission methods failed. Please try again later.' };
}

async function submitEmailToGoogleSheets(email) {
  try {
    console.log('Attempting to submit email:', email);
    console.log('URL:', GOOGLE_APPS_SCRIPT_URL);
    
    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // This might help with CORS issues
      body: JSON.stringify({
        email: email,
        source: 'Seekers Website'
      })
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    // If response is not ok, throw an error
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Response result:', result);
    return result;
  } catch (error) {
    console.error('Detailed error submitting email:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    // Provide more specific error messages
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
      return { success: false, message: 'Network error: Unable to connect to server. Please check your internet connection.' };
    } else if (error.message.includes('CORS')) {
      return { success: false, message: 'CORS error: This might be due to running the site locally. Try hosting it on a web server.' };
    } else {
      return { success: false, message: 'Network error: ' + error.message };
    }
  }
}

// Email form submit logic
if (popupEmailForm && popupSuccess) {
  popupEmailForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('popupEmailInput');
    const email = emailInput.value.trim();
    
    if (!email) {
      alert('Please enter a valid email address');
      return;
    }
    
    // Show loading state
    const submitButton = popupEmailForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Signing up...';
    submitButton.disabled = true;
    
    try {
      // Use only the FormData method since it's working
      const result = await submitEmailToGoogleSheetsFormData(email);
      
      if (result.success) {
        // Show success message
        popupEmailForm.style.display = 'none';
        popupSuccess.style.display = 'flex';
      } else {
        // Show error message
        alert('Error: ' + (result.message || 'Failed to sign up. Please try again.'));
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    }
  });
}



// FAQ accordion
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  question.addEventListener('click', () => {
    item.classList.toggle('active');
  });
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navCenter = document.querySelector('.nav-center');

if (navToggle && navCenter) {
  navToggle.addEventListener('click', function() {
    navToggle.classList.toggle('active');
    navCenter.classList.toggle('active');
  });
  
  // Close mobile menu when clicking on a link
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navToggle.classList.remove('active');
      navCenter.classList.remove('active');
    });
  });
}

// Smooth scroll for nav links
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Music and volume control
const bgMusic = document.getElementById('bgMusic');
const volumeControl = document.querySelector('.volume-control');
const volumeIcon = document.querySelector('.volume-icon');
const volumeSlider = document.querySelector('.volume-slider');

if (bgMusic) {
  bgMusic.volume = 0.5;
  bgMusic.muted = true;
}

let hasStartedMusic = false;
let sliderVisible = false;

if (volumeIcon && volumeSlider && volumeControl && bgMusic) {
  // Always start with slashed icon
  volumeIcon.classList.remove('fa-volume-up');
  volumeIcon.classList.add('fa-volume-mute');

  // Handle both click and touch events for mobile compatibility
  const handleVolumeIconInteraction = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!hasStartedMusic) {
      // First click: unmute and play
      bgMusic.muted = false;
      bgMusic.play().catch(() => {});
      volumeIcon.classList.remove('fa-volume-mute');
      volumeIcon.classList.add('fa-volume-up');
      volumeIcon.classList.add('active');
      hasStartedMusic = true;
      sliderVisible = false;
      volumeSlider.style.display = 'none';
    } else {
      // Toggle slider
      sliderVisible = !sliderVisible;
      volumeSlider.style.display = sliderVisible ? 'block' : 'none';
      volumeControl.classList.toggle('active', sliderVisible);
    }
  };

  // Add both click and touch event listeners
  volumeIcon.addEventListener('click', handleVolumeIconInteraction);
  volumeIcon.addEventListener('touchstart', handleVolumeIconInteraction);

  // Hide slider when clicking/touching outside
  const handleOutsideClick = (e) => {
    if (!volumeControl.contains(e.target)) {
      sliderVisible = false;
      volumeSlider.style.display = 'none';
      volumeControl.classList.remove('active');
    }
  };

  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('touchstart', handleOutsideClick);

  // Update volume and icon on slider change (works for both mouse and touch)
  const handleSliderChange = (e) => {
    const vol = parseFloat(e.target.value);
    bgMusic.volume = vol;
    if (vol === 0) {
      bgMusic.muted = true;
      volumeIcon.classList.remove('fa-volume-up');
      volumeIcon.classList.add('fa-volume-mute');
      volumeIcon.classList.remove('active');
    } else {
      bgMusic.muted = false;
      volumeIcon.classList.remove('fa-volume-mute');
      volumeIcon.classList.add('fa-volume-up');
      volumeIcon.classList.add('active');
    }
  };

  volumeSlider.addEventListener('input', handleSliderChange);
  volumeSlider.addEventListener('change', handleSliderChange);
} 