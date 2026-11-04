/**
 * CivicConnect - Front-end Controller
 * Handles client-side validation, asynchronous backend API communication,
 * location verification error presentation, and cross-page live sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initChatAssistant();
  initLanguageSelector();
  initFileComplaintPage();
  initTrackComplaintPage();
  initDepartmentDashboard();
});

/**
 * Translation helper shortcut
 */
function tr(key) {
  if (window.CivicTranslate && typeof window.CivicTranslate.t === 'function') {
    return window.CivicTranslate.t(key);
  }
  return key;
}

/* ==========================================================================
   1. Mobile Navigation Toggle
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('mainNav');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/* ==========================================================================
   2. Shared Chat Assistant
   ========================================================================== */
function initChatAssistant() {
  const chatFab = document.getElementById('chatFab');
  const chatPanel = document.getElementById('chatPanel');
  const chatCloseBtn = document.getElementById('chatCloseBtn');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatBody = document.getElementById('chatBody');
  const chatChips = document.querySelectorAll('.chat-chip');

  if (!chatFab || !chatPanel) return;

  chatFab.addEventListener('click', () => {
    chatPanel.classList.toggle('open');
    const isOpen = chatPanel.classList.contains('open');
    chatFab.setAttribute('aria-expanded', isOpen);
    if (isOpen && chatInput) {
      chatInput.focus();
    }
  });

  if (chatCloseBtn) {
    chatCloseBtn.addEventListener('click', () => {
      chatPanel.classList.remove('open');
      chatFab.setAttribute('aria-expanded', 'false');
    });
  }

  chatChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      sendUserMessage(chip.textContent.trim());
    });
  });

  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text) return;
      sendUserMessage(text);
      chatInput.value = '';
    });
  }

  function sendUserMessage(text) {
    if (!chatBody) return;

    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble chat-bubble-user';
    userBubble.textContent = text;
    chatBody.appendChild(userBubble);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
      const botBubble = document.createElement('div');
      botBubble.className = 'chat-bubble chat-bubble-bot';
      botBubble.innerHTML = `
        <span class="chat-prototype-tag">Civic Assistant</span>
        <div>Thank you for asking about <em>"${escapeHtml(text)}"</em>. In our upcoming release, this assistant will answer ward-level FAQs, detect location landmarks, and retrieve instant complaint status.</div>
      `;
      chatBody.appendChild(botBubble);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, 400);
  }
}

/* ==========================================================================
   3. Language Switcher (Delegated to translations.js)
   ========================================================================== */
function initLanguageSelector() {
  // Handled smoothly by static/js/translations.js
}

/* ==========================================================================
   4. Page 1 — File a Complaint (With Real-Time Location & Phone Verification)
   ========================================================================== */
function initFileComplaintPage() {
  const form = document.getElementById('civicComplaintForm');
  const defaultView = document.getElementById('viewFormDefault');
  const errorView = document.getElementById('viewFormError');
  const successView = document.getElementById('viewFormSuccess');
  const alertTitle = document.getElementById('alertTitle');
  const alertDesc = document.getElementById('alertDesc');
  const submitBtn = document.getElementById('submitComplaintBtn');

  const copyBtn = document.getElementById('copyRefBtn');
  const resetBtn = document.getElementById('fileAnotherBtn');

  const locationInput = document.getElementById('location');
  const descInput = document.getElementById('description');
  const phoneInput = document.getElementById('citizenPhone');
  const nameInput = document.getElementById('citizenName');
  const catSelect = document.getElementById('category');

  const locGroup = document.getElementById('groupLocation');
  const descGroup = document.getElementById('groupDescription');
  const phoneGroup = document.getElementById('groupPhone');
  const proofGroup = document.getElementById('groupProofImages');

  const locError = document.getElementById('locationError');
  const locAiError = document.getElementById('locationAiError');
  const descError = document.getElementById('descError');
  const phoneError = document.getElementById('phoneError');
  const proofError = document.getElementById('proofError');
  const proofErrorText = document.getElementById('proofErrorText');

  if (!form || !defaultView) return;

  // ---- Initialize GPS / Map Picker ----
  initLocationPicker();

  // ---- Initialize Proof Image Upload UI ----
  initProofImageUpload();

  // Indian Phone Validation Helper
  function validateIndianPhone(phoneStr) {
    if (!phoneStr) return true;
    const trimmed = phoneStr.trim();
    if (trimmed === '') return true;

    let cleaned = trimmed.replace(/[\s\-\(\)\.]/g, '');
    if (cleaned.startsWith('+91')) {
      cleaned = cleaned.substring(3);
    } else if (cleaned.startsWith('91') && cleaned.length === 12) {
      cleaned = cleaned.substring(2);
    } else if (cleaned.startsWith('0') && cleaned.length === 11) {
      cleaned = cleaned.substring(1);
    }

    return /^[6-9]\d{9}$/.test(cleaned);
  }

  // Proof Images Validation Helper (mandatory, 1-6 images, ≤ 5MB each)
  function validateProofImages() {
    const fileInput = document.getElementById('proofImages');
    if (!fileInput) return { ok: true };

    const files = fileInput.files;
    const maxCount = 6;
    const maxSize = 5 * 1024 * 1024; // 5 MB

    if (files.length === 0) {
      return { ok: false, msg: tr('Please upload at least one proof image.') };
    }
    if (files.length > maxCount) {
      return { ok: false, msg: tr('You can upload a maximum of 6 images.') };
    }
    for (let f of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        return { ok: false, msg: tr('Only JPG, PNG, or WebP images are allowed. Remove invalid files.') };
      }
      if (f.size > maxSize) {
        return { ok: false, msg: `"${f.name}" ` + tr('exceeds 5 MB. Please use a smaller image.') };
      }
    }
    return { ok: true };
  }

  function clearAllErrors() {
    if (locGroup) locGroup.classList.remove('has-error');
    if (descGroup) descGroup.classList.remove('has-error');
    if (phoneGroup) phoneGroup.classList.remove('has-error');
    if (proofGroup) proofGroup.classList.remove('has-error');

    if (locError) locError.style.display = 'none';
    if (locAiError) locAiError.style.display = 'none';
    if (descError) descError.style.display = 'none';
    if (phoneError) phoneError.style.display = 'none';
    if (proofError) proofError.style.display = 'none';
    if (errorView) errorView.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const locVal = locationInput ? locationInput.value.trim() : '';
    const descVal = descInput ? descInput.value.trim() : '';
    const phoneVal = phoneInput ? phoneInput.value.trim() : '';
    const nameVal = nameInput ? nameInput.value.trim() : '';
    const catVal = catSelect ? catSelect.options[catSelect.selectedIndex].text : 'General Civic Issue';

    // 1. Client-Side Required Field Checks
    let clientError = false;

    if (!locVal) {
      if (locGroup) locGroup.classList.add('has-error');
      if (locError) locError.style.display = 'flex';
      clientError = true;
    }

    if (!descVal) {
      if (descGroup) descGroup.classList.add('has-error');
      if (descError) descError.style.display = 'flex';
      clientError = true;
    }

    // 2. Proof Images mandatory check
    const proofCheck = validateProofImages();
    if (!proofCheck.ok) {
      if (proofGroup) proofGroup.classList.add('has-error');
      if (proofError) proofError.style.display = 'flex';
      if (proofErrorText) proofErrorText.textContent = proofCheck.msg;
      clientError = true;
    }

    // 3. Client-Side Phone Format Check
    if (!validateIndianPhone(phoneVal)) {
      if (phoneGroup) phoneGroup.classList.add('has-error');
      if (phoneError) phoneError.style.display = 'flex';
      clientError = true;
    }

    if (clientError) {
      if (errorView) {
        errorView.style.display = 'flex';
        if (alertTitle) alertTitle.textContent = "Please correct the highlighted fields";
        if (alertDesc) alertDesc.textContent = "Location, description, and at least one proof image are required. If a phone number is entered, it must be a valid 10-digit Indian number.";
        errorView.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // 4. Submit to Server using FormData (for file uploads)
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 6px;">⏳</span>
        <span>Verifying location &amp; filing complaint...</span>
      `;
    }

    try {
      const formData = new FormData();
      formData.append('category', catVal);
      formData.append('location', locVal);
      formData.append('description', descVal);
      formData.append('citizenName', nameVal);
      formData.append('citizenPhone', phoneVal);

      // Append proof images
      const fileInput = document.getElementById('proofImages');
      if (fileInput && fileInput.files) {
        for (let i = 0; i < fileInput.files.length && i < 6; i++) {
          formData.append('proofImages', fileInput.files[i]);
        }
      }

      const response = await fetch('/api/complaints', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        // Backend Validation Error
        if (result.field === 'location') {
          if (locGroup) locGroup.classList.add('has-error');
          if (locAiError) {
            locAiError.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
              <span><strong>Location verification failed:</strong> ${escapeHtml(result.error || "Invalid location.")}</span>
            `;
            locAiError.style.display = 'flex';
          }
        } else if (result.field === 'citizenPhone') {
          if (phoneGroup) phoneGroup.classList.add('has-error');
          if (phoneError) phoneError.style.display = 'flex';
        } else if (result.field === 'proofImages') {
          if (proofGroup) proofGroup.classList.add('has-error');
          if (proofError) proofError.style.display = 'flex';
          if (proofErrorText) proofErrorText.textContent = result.error;
        }

        if (errorView) {
          errorView.style.display = 'flex';
          if (alertTitle) alertTitle.textContent = "Validation Error";
          if (alertDesc) alertDesc.textContent = result.error || "Please check the highlighted fields.";
          errorView.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        // Complaint Successfully Created & Persisted!
        const ticket = result.ticket;

        const genRef = document.getElementById('generatedRefNumber');
        const succCat = document.getElementById('successCategory');
        const succLoc = document.getElementById('successLocation');
        const trackLink = document.getElementById('trackComplaintLink');

        if (genRef) genRef.textContent = ticket.id;
        if (succCat) succCat.textContent = ticket.category;
        if (succLoc) succLoc.textContent = ticket.location;
        if (trackLink) trackLink.href = `/track-complaint?ref=${encodeURIComponent(ticket.id)}`;

        if (defaultView) defaultView.style.display = 'none';
        if (errorView) errorView.style.display = 'none';
        if (successView) {
          successView.style.display = 'block';
          successView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    } catch (err) {
      console.error("Submission failed:", err);
      if (errorView) {
        errorView.style.display = 'flex';
        if (alertTitle) alertTitle.textContent = "Server Connection Error";
        if (alertDesc) alertDesc.textContent = "Could not communicate with the verification server. Please verify your connection and try again.";
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const refNum = document.getElementById('generatedRefNumber')?.textContent || 'CC-2026-8942';
      navigator.clipboard.writeText(refNum).then(() => {
        copyBtn.textContent = 'Copied!';
        setTimeout(() => { copyBtn.textContent = 'Copy Reference'; }, 2000);
      });
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearAllErrors();
      // Clear image previews
      const previewGrid = document.getElementById('proofPreviewGrid');
      if (previewGrid) previewGrid.innerHTML = '';
      // Hide map
      const mapDiv = document.getElementById('mapPicker');
      if (mapDiv) mapDiv.style.display = 'none';
      const gpsBtn = document.getElementById('useGpsBtn');
      if (gpsBtn) {
        gpsBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span id="useGpsBtnText">${escapeHtml(tr('Use My Current Location'))}</span>
        `;
      }
      if (defaultView) defaultView.style.display = 'block';
      if (successView) successView.style.display = 'none';
    });
  }
}

/* ==========================================================================
   4a. Proof Image Upload — Drag & Drop + Click + Preview
   ========================================================================== */
function initProofImageUpload() {
  const dropZone = document.getElementById('proofDropZone');
  const fileInput = document.getElementById('proofImages');
  const previewGrid = document.getElementById('proofPreviewGrid');

  if (!dropZone || !fileInput) return;

  // Click on drop zone opens file picker
  dropZone.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag & drop visual feedback
  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--color-accent, #2563eb)';
    dropZone.style.background = '#eff6ff';
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--color-border)';
    dropZone.style.background = 'var(--color-bg-subtle, #f8fafc)';
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--color-border)';
    dropZone.style.background = 'var(--color-bg-subtle, #f8fafc)';

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      fileInput.files = e.dataTransfer.files;
      renderPreviews(fileInput.files);
    }
  });

  // When files are selected via the file picker
  fileInput.addEventListener('change', () => {
    renderPreviews(fileInput.files);
  });

  function renderPreviews(files) {
    if (!previewGrid) return;
    previewGrid.innerHTML = '';

    const count = Math.min(files.length, 6);
    for (let i = 0; i < count; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const wrapper = document.createElement('div');
      wrapper.style.cssText = 'position:relative; width:100px; height:100px; border-radius:8px; overflow:hidden; border:1.5px solid var(--color-border); background:#f1f5f9;';

      const img = document.createElement('img');
      img.style.cssText = 'width:100%; height:100%; object-fit:cover;';
      img.alt = file.name;

      const reader = new FileReader();
      reader.onload = (ev) => { img.src = ev.target.result; };
      reader.readAsDataURL(file);

      wrapper.appendChild(img);

      // File size label
      const sizeLabel = document.createElement('div');
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      sizeLabel.textContent = sizeMB + ' MB';
      sizeLabel.style.cssText = 'position:absolute; bottom:0; left:0; right:0; background:rgba(0,0,0,0.6); color:#fff; font-size:0.65rem; text-align:center; padding:2px 0;';
      wrapper.appendChild(sizeLabel);

      previewGrid.appendChild(wrapper);
    }

    if (files.length > 6) {
      const warn = document.createElement('div');
      warn.style.cssText = 'color: #dc2626; font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; padding: 0.5rem;';
      warn.textContent = tr('You can upload a maximum of 6 images.');
      previewGrid.appendChild(warn);
    }
  }
}

/* ==========================================================================
   4b. GPS / Leaflet Map Picker
   ========================================================================== */
function initLocationPicker() {
  const gpsBtn = document.getElementById('useGpsBtn');
  const mapDiv = document.getElementById('mapPicker');
  const locationInput = document.getElementById('location');
  const gpsStatus = document.getElementById('gpsStatus');

  if (!gpsBtn || !mapDiv || !locationInput) return;

  let map = null;
  let marker = null;

  // Reverse-geocode via local API with Nominatim fallback
  async function reverseGeocode(lat, lon) {
    try {
      const resp = await fetch(`/api/reverse-geocode?lat=${lat}&lon=${lon}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data.address) return data.address;
      }
    } catch (_) {}

    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`, {
        headers: { 'User-Agent': 'CivicConnect/1.0' }
      });
      const data = await resp.json();
      return data.display_name || `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    } catch (_) {
      return `${lat.toFixed(6)}, ${lon.toFixed(6)}`;
    }
  }

  gpsBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    gpsBtn.disabled = true;
    const btnSpan = document.getElementById('useGpsBtnText');
    if (btnSpan) {
      btnSpan.textContent = tr('Detecting your location...');
    }
    if (gpsStatus) {
      gpsStatus.style.display = 'block';
      gpsStatus.textContent = tr('Requesting GPS access...');
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        if (gpsStatus) gpsStatus.textContent = tr('Resolving address...');

        const addr = await reverseGeocode(latitude, longitude);
        locationInput.value = addr;

        if (gpsStatus) {
          gpsStatus.textContent = '✅ ' + tr('Location detected successfully!');
          setTimeout(() => { gpsStatus.style.display = 'none'; }, 3000);
        }

        // Show Leaflet map with a draggable pin
        mapDiv.style.display = 'block';

        if (!map) {
          map = L.map('mapPicker').setView([latitude, longitude], 16);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
          }).addTo(map);
          marker = L.marker([latitude, longitude], { draggable: true }).addTo(map);

          // When user drags the pin, update address
          marker.on('dragend', async (e) => {
            const { lat, lng } = e.target.getLatLng();
            locationInput.value = tr('Resolving address...');
            const newAddr = await reverseGeocode(lat, lng);
            locationInput.value = newAddr;
          });

          // When user clicks on the map, move pin there
          map.on('click', async (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            locationInput.value = tr('Resolving address...');
            const newAddr = await reverseGeocode(lat, lng);
            locationInput.value = newAddr;
          });
        } else {
          map.setView([latitude, longitude], 16);
          marker.setLatLng([latitude, longitude]);
        }

        // Fix map rendering after display:block
        setTimeout(() => { map.invalidateSize(); }, 200);

        gpsBtn.disabled = false;
        gpsBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span id="useGpsBtnText">${escapeHtml(tr('Re-detect My Location'))}</span>
        `;
      },
      (err) => {
        alert('Unable to retrieve location: ' + err.message);
        gpsBtn.disabled = false;
        gpsBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <span id="useGpsBtnText">${escapeHtml(tr('Use My Current Location'))}</span>
        `;
        if (gpsStatus) gpsStatus.style.display = 'none';
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/* ==========================================================================
   5. Page 2 — Track a Complaint (Live Backend Lookup & Timeline)
   ========================================================================== */
function initTrackComplaintPage() {
  const searchForm = document.getElementById('trackSearchForm');
  const refInput = document.getElementById('refNumberInput');
  const viewEmpty = document.getElementById('trackViewEmpty');
  const viewResult = document.getElementById('trackViewResult');
  const viewNotFound = document.getElementById('trackViewNotFound');
  const sampleLinks = document.querySelectorAll('.sample-ref-trigger');

  if (!viewEmpty && !viewResult) return;

  async function performLookup(refId) {
    const cleanId = (refId || '').trim().toUpperCase();

    if (!cleanId) {
      if (viewEmpty) viewEmpty.style.display = 'block';
      if (viewResult) viewResult.style.display = 'none';
      if (viewNotFound) viewNotFound.style.display = 'none';
      return;
    }

    try {
      const res = await fetch(`/api/complaints/${encodeURIComponent(cleanId)}`);
      const data = await res.json();

      if (!res.ok || !data.success || !data.ticket) {
        const queryDisplay = document.getElementById('notFoundQuery');
        if (queryDisplay) queryDisplay.textContent = cleanId;

        if (viewEmpty) viewEmpty.style.display = 'none';
        if (viewResult) viewResult.style.display = 'none';
        if (viewNotFound) viewNotFound.style.display = 'block';
        return;
      }

      // Populate Result Card with Real Data
      const t = data.ticket;
      populateResultCard(t);

      if (viewEmpty) viewEmpty.style.display = 'none';
      if (viewNotFound) viewNotFound.style.display = 'none';
      if (viewResult) viewResult.style.display = 'block';

    } catch (err) {
      console.error("Track lookup failed:", err);
    }
  }

  function populateResultCard(t) {
    setElemText('resultRefNumber', t.id);
    setElemText('resultCategory', t.category);
    setElemText('resultDate', t.date);
    setElemText('resultLocation', t.location);
    setElemText('resultDesc', t.desc);
    setElemText('resultDeptNotes', t.department_notes || 'No notes published yet.');

    // Render Attached Proof Images in Tracking Page
    const trackProofSec = document.getElementById('trackProofImagesSection');
    const trackProofGrid = document.getElementById('trackProofGrid');
    if (trackProofSec && trackProofGrid) {
      if (t.images && t.images.length > 0) {
        trackProofSec.style.display = 'block';
        trackProofGrid.innerHTML = t.images.map((url, idx) => `
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer"
             style="display: block; position: relative; width: 85px; height: 85px; border-radius: var(--radius-sm); overflow: hidden; border: 1.5px solid var(--color-border); box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.15s; background: #fff;"
             onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'"
             title="Click to view full image in new tab">
            <img src="${escapeHtml(url)}" alt="Proof photo ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65); color: #fff; font-size: 0.625rem; text-align: center; padding: 1px 0;">Photo ${idx + 1}</span>
          </a>
        `).join('');
      } else {
        trackProofSec.style.display = 'none';
      }
    }

    // Status Badge
    const badgeElem = document.getElementById('resultStatusBadge');
    if (badgeElem) {
      badgeElem.className = 'badge ' + getBadgeClass(t.status);
      badgeElem.innerHTML = `<span class="badge-dot"></span>${escapeHtml(t.status)}`;
    }

    // Dynamic Timeline Rendering
    renderTimeline(t.status, t.timeline || []);

    // Dynamic AI Analysis & Monitoring Roadmap
    const ai = t.ai_analysis || {};
    setElemText('aiKeyIssue', ai.key_issue || `${t.category} Resolution Plan`);
    setElemText('aiAuthority', ai.assigned_authority || 'Municipal Operations & Environment Division');
    setElemText('aiLegalFramework', ai.legal_framework || 'Municipal Corporation Act & Citizen Charter Bye-Laws');

    const prioText = ai.priority || 'Medium';
    setElemText('aiPriorityText', 'Priority: ' + prioText);

    const prioBadge = document.getElementById('aiPriorityBadge');
    if (prioBadge) {
      const p = prioText.toLowerCase();
      if (p === 'critical') {
        prioBadge.style.background = '#fee2e2';
        prioBadge.style.color = '#991b1b';
        prioBadge.style.borderColor = '#fca5a5';
      } else if (p === 'high') {
        prioBadge.style.background = '#fef3c7';
        prioBadge.style.color = '#92400e';
        prioBadge.style.borderColor = '#fcd34d';
      } else {
        prioBadge.style.background = '#e0f2fe';
        prioBadge.style.color = '#0369a1';
        prioBadge.style.borderColor = '#7dd3fc';
      }
    }

    const roadmapContainer = document.getElementById('aiRoadmapSteps');
    if (roadmapContainer) {
      const steps = ai.monitoring_roadmap || [];
      if (steps.length === 0) {
        roadmapContainer.innerHTML = '<p style="color: var(--color-text-muted); font-size: 0.85rem;">Standard inspection procedure will be logged by field inspector.</p>';
      } else {
        roadmapContainer.innerHTML = steps.map((step) => `
          <div style="background: #ffffff; border: 1px solid #fed7aa; border-radius: var(--radius-sm); padding: 0.85rem; display: flex; flex-direction: column; gap: 0.25rem;">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: var(--color-accent); color: #fff; font-size: 0.6875rem; font-weight: 700; flex-shrink: 0;">✓</span>
              <strong style="color: var(--color-primary); font-size: 0.875rem;">${escapeHtml(step.phase)}</strong>
            </div>
            <p style="font-size: 0.8125rem; color: var(--color-text); margin: 0; line-height: 1.45;">
              ${escapeHtml(step.procedure)}
            </p>
          </div>
        `).join('');
      }
    }

    // Auto-translate dynamic roadmap if a regional language is active (Hindi, Tamil, Kannada)
    const activeLang = localStorage.getItem('civic_lang');
    if (window.CivicTranslate && activeLang && activeLang !== 'en') {
      window.CivicTranslate.translateDynamicContent(activeLang);
    }
  }

  function renderTimeline(status, timelineEvents) {
    const timelineContainer = document.getElementById('trackTimelineContainer');
    if (!timelineContainer) return;

    const normStatus = (status || '').toLowerCase();

    // Step states: completed, current, pending
    let step1Class = "completed";
    let step2Class = normStatus === "resolved" ? "completed" : (normStatus === "in progress" ? "current" : "pending");
    let step3Class = normStatus === "resolved" ? "completed" : "pending";

    // Extract dates
    let time1 = "Received & Queued";
    let time2 = normStatus === "in progress" ? "Field team active" : "Scheduled";
    let time3 = normStatus === "resolved" ? "Work completed & closed" : "Estimated 48h";

    if (timelineEvents.length > 0) {
      time1 = timelineEvents[0].time || time1;
    }
    if (timelineEvents.length > 1) {
      time2 = timelineEvents[1].time || time2;
    }
    if (normStatus === "resolved" && timelineEvents.length > 2) {
      time3 = timelineEvents[2].time || time3;
    }

    timelineContainer.innerHTML = `
      <div class="timeline-step ${step1Class}">
        <div class="timeline-dot">✓</div>
        <div class="timeline-content">
          <div class="timeline-title">1. Received</div>
          <div class="timeline-time">${escapeHtml(time1)}</div>
          <div class="timeline-desc">Grievance verified and logged into municipal dispatch queue.</div>
        </div>
      </div>

      <div class="timeline-step ${step2Class}">
        <div class="timeline-dot">${normStatus === "resolved" ? "✓" : "2"}</div>
        <div class="timeline-content">
          <div class="timeline-title" ${step2Class === "current" ? 'style="color: var(--color-accent);"' : ''}>2. In Progress</div>
          <div class="timeline-time">${escapeHtml(time2)}</div>
          <div class="timeline-desc">Field inspection scheduled or repair crew dispatched to site.</div>
        </div>
      </div>

      <div class="timeline-step ${step3Class}">
        <div class="timeline-dot">${normStatus === "resolved" ? "✓" : "3"}</div>
        <div class="timeline-content">
          <div class="timeline-title" ${normStatus === "resolved" ? 'style="color: #16a34a;"' : ''}>3. Resolved</div>
          <div class="timeline-time">${escapeHtml(time3)}</div>
          <div class="timeline-desc">Issue resolved, site sanitized, and closure confirmed.</div>
        </div>
      </div>
    `;
  }

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = refInput ? refInput.value.trim() : '';
      performLookup(val);
    });
  }

  sampleLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sampleId = 'CC-2026-8942';
      if (refInput) refInput.value = sampleId;
      performLookup(sampleId);
    });
  });

  // Check URL parameter (e.g. /track-complaint?ref=CC-2026-8943)
  const urlParams = new URLSearchParams(window.location.search);
  const refFromUrl = urlParams.get('ref');
  if (refFromUrl) {
    if (refInput) refInput.value = refFromUrl;
    performLookup(refFromUrl);
  }
}

/* ==========================================================================
   6. Page 3 — Department Dashboard (Live Queue & Status Updates)
   ========================================================================== */
function initDepartmentDashboard() {
  const table = document.getElementById('complaintsTable');
  const searchInput = document.getElementById('dashSearchInput');
  const statusFilter = document.getElementById('dashStatusFilter');
  const categoryFilter = document.getElementById('dashCategoryFilter');
  const updateBtn = document.getElementById('updateStatusBtn');
  const updateConfirm = document.getElementById('updateConfirmBox');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');

  if (!table) return;

  const rows = table.querySelectorAll('tbody tr');
  let selectedRow = table.querySelector('tbody tr.selected') || rows[0];

  // Initialize selected row
  if (selectedRow) {
    selectRow(selectedRow);
  }

  rows.forEach((row) => {
    row.addEventListener('click', () => {
      selectRow(row);
    });
  });

  function selectRow(row) {
    rows.forEach((r) => r.classList.remove('selected'));
    row.classList.add('selected');
    selectedRow = row;

    const id = row.getAttribute('data-id');
    const date = row.getAttribute('data-date');
    const category = row.getAttribute('data-category');
    const location = row.getAttribute('data-location');
    const citizen = row.getAttribute('data-citizen');
    const phone = row.getAttribute('data-phone');
    const status = row.getAttribute('data-status');
    const desc = row.getAttribute('data-desc');
    const notes = row.getAttribute('data-notes');

    setElemText('detailRefId', id);
    setElemText('detailCategory', category);
    setElemText('detailLocation', location);
    setElemText('detailDate', date);
    setElemText('detailCitizen', citizen);
    setElemText('detailPhone', phone);
    setElemText('detailDesc', desc);

    const notesInput = document.getElementById('updateInternalNotes');
    if (notesInput) {
      notesInput.value = (notes && notes !== 'None') ? notes : '';
    }

    // Render uploaded evidence images in detail panel
    let images = [];
    try {
      const rawImages = row.getAttribute('data-images');
      images = rawImages ? JSON.parse(rawImages) : [];
    } catch (e) {
      images = [];
    }

    const proofCount = document.getElementById('detailProofCount');
    if (proofCount) {
      const count = images.length;
      const unit = count === 1 ? tr('photo') : tr('photos');
      proofCount.textContent = `${count} ${unit}`;
    }

    const proofGrid = document.getElementById('detailProofGrid');
    if (proofGrid) {
      if (images && images.length > 0) {
        proofGrid.innerHTML = images.map((imgUrl, idx) => `
          <div class="proof-card-item" data-idx="${idx}" style="cursor: pointer; position: relative; width: 85px; height: 85px; border-radius: var(--radius-sm); overflow: hidden; border: 1.5px solid var(--color-border); box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.15s, box-shadow 0.15s; background: #fff;" title="${escapeHtml(tr('Click to inspect / enlarge proof photo'))}">
            <img src="${escapeHtml(imgUrl)}" alt="Evidence photo ${idx + 1}" style="width: 100%; height: 100%; object-fit: cover;">
            <div class="thumb-hover-tag" style="position: absolute; inset: 0; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.15s; display: flex; align-items: center; justify-content: center;">
              <span style="background: rgba(0,0,0,0.75); color: #fff; font-size: 0.65rem; padding: 2px 6px; border-radius: 4px;">🔍 ${escapeHtml(tr('View'))}</span>
            </div>
            <span style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.65); color: #fff; font-size: 0.625rem; text-align: center; padding: 1px 0;">${escapeHtml(tr('Photo'))} ${idx + 1}</span>
          </div>
        `).join('');

        proofGrid.querySelectorAll('.proof-card-item').forEach((card) => {
          card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.06)';
            const tag = card.querySelector('.thumb-hover-tag');
            if (tag) tag.style.opacity = '1';
          });
          card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
            const tag = card.querySelector('.thumb-hover-tag');
            if (tag) tag.style.opacity = '0';
          });
          card.addEventListener('click', () => {
            const idx = parseInt(card.getAttribute('data-idx'), 10) || 0;
            openImageModal(images, idx, id, category, location);
          });
        });
      } else {
        proofGrid.innerHTML = `
          <div id="detailNoImagesMsg" style="color: var(--color-text-muted); font-size: 0.825rem; font-style: italic; padding: 0.5rem 0;">
            ${escapeHtml(tr('No photographic proof attached to this ticket.'))}
          </div>
        `;
      }
    }

    const badgeElem = document.getElementById('detailStatusBadge');
    if (badgeElem) {
      badgeElem.className = 'badge ' + getBadgeClass(status);
      badgeElem.innerHTML = `<span class="badge-dot"></span>${escapeHtml(status)}`;
    }

    const statusSelect = document.getElementById('updateStatusSelect');
    if (statusSelect) {
      for (let i = 0; i < statusSelect.options.length; i++) {
        if (statusSelect.options[i].text.toLowerCase().trim() === status.toLowerCase().trim()) {
          statusSelect.selectedIndex = i;
          break;
        }
      }
    }

    if (updateConfirm) updateConfirm.classList.remove('visible');
  }

  // Live Status Update via Backend API
  if (updateBtn) {
    updateBtn.addEventListener('click', async () => {
      if (!selectedRow) return;

      const refId = selectedRow.getAttribute('data-id');
      const select = document.getElementById('updateStatusSelect');
      const selectedStatus = select ? select.options[select.selectedIndex].text : 'In Progress';
      const notesInput = document.getElementById('updateInternalNotes');
      const notesVal = notesInput ? notesInput.value.trim() : '';

      updateBtn.disabled = true;
      updateBtn.innerHTML = `<span>Saving...</span>`;

      try {
        const response = await fetch(`/api/complaints/${encodeURIComponent(refId)}/status`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: selectedStatus,
            notes: notesVal
          })
        });

        const resData = await response.json();

        if (response.ok && resData.success) {
          // Update row attributes and badge in DOM
          selectedRow.setAttribute('data-status', selectedStatus);
          selectedRow.setAttribute('data-notes', notesVal);

          const rowBadge = selectedRow.querySelector('.badge');
          if (rowBadge) {
            rowBadge.className = 'badge ' + getBadgeClass(selectedStatus);
            rowBadge.innerHTML = `<span class="badge-dot"></span>${escapeHtml(selectedStatus)}`;
          }

          // Update detail badge
          const detailBadge = document.getElementById('detailStatusBadge');
          if (detailBadge) {
            detailBadge.className = 'badge ' + getBadgeClass(selectedStatus);
            detailBadge.innerHTML = `<span class="badge-dot"></span>${escapeHtml(selectedStatus)}`;
          }

          // Update KPI card numbers
          if (resData.metrics) {
            setElemText('metricTotal', resData.metrics.total);
            setElemText('metricPending', resData.metrics.pending);
            setElemText('metricProgress', resData.metrics.in_progress);
            setElemText('metricResolved', resData.metrics.resolved);
          }

          if (updateConfirm) {
            updateConfirm.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
              <span>Status successfully updated to <strong>${escapeHtml(selectedStatus)}</strong>. Official audit stamp recorded.</span>
            `;
            updateConfirm.classList.add('visible');
          }
        } else if (response.status === 401 || resData.requires_login) {
          alert(resData.error || "Access Denied: Only authenticated municipal department officers can modify complaints. Redirecting to officer login.");
          window.location.href = '/department-login';
        } else {
          alert(resData.error || "Failed to update complaint status. Please try again.");
        }
      } catch (err) {
        console.error("Status update failed:", err);
      } finally {
        updateBtn.disabled = false;
        updateBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Save &amp; Notify Citizen</span>
        `;
      }
    });
  }

  // Evidence Lightbox Inspection Modal Controls
  const modal = document.getElementById('imageInspectionModal');
  const modalImg = document.getElementById('modalMainImg');
  const modalIndex = document.getElementById('modalImgIndex');
  const modalContext = document.getElementById('modalContextInfo');
  const modalOpenTab = document.getElementById('modalOpenTabBtn');
  const modalClose = document.getElementById('modalCloseBtn');
  const modalDismiss = document.getElementById('modalDismissBtn');
  const modalPrev = document.getElementById('modalPrevBtn');
  const modalNext = document.getElementById('modalNextBtn');

  let currentModalImages = [];
  let currentModalIndex = 0;
  let currentRefId = '';
  let currentCat = '';
  let currentLoc = '';

  function openImageModal(images, index, refId, category, location) {
    if (!modal || !images || images.length === 0) return;
    currentModalImages = images;
    currentModalIndex = index;
    currentRefId = refId;
    currentCat = category;
    currentLoc = location;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    updateModalView();
  }

  function updateModalView() {
    if (!modalImg || currentModalImages.length === 0) return;
    const url = currentModalImages[currentModalIndex];
    modalImg.src = url;

    if (modalOpenTab) modalOpenTab.href = url;
    if (modalIndex) {
      modalIndex.textContent = `${tr('Photo')} ${currentModalIndex + 1} of ${currentModalImages.length}`;
    }
    if (modalContext) {
      modalContext.innerHTML = `
        <strong>${escapeHtml(currentRefId || '')}</strong> &bull; 
        <span>${escapeHtml(currentCat || '')}</span> &bull; 
        <span style="color: var(--color-text-muted);">${escapeHtml(currentLoc || '')}</span>
      `;
    }

    if (modalPrev) modalPrev.style.display = currentModalImages.length > 1 ? 'flex' : 'none';
    if (modalNext) modalNext.style.display = currentModalImages.length > 1 ? 'flex' : 'none';
  }

  function closeImageModal() {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (modalClose) modalClose.addEventListener('click', closeImageModal);
  if (modalDismiss) modalDismiss.addEventListener('click', closeImageModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeImageModal();
    });
  }

  if (modalPrev) {
    modalPrev.addEventListener('click', () => {
      if (currentModalImages.length > 1) {
        currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
        updateModalView();
      }
    });
  }

  if (modalNext) {
    modalNext.addEventListener('click', () => {
      if (currentModalImages.length > 1) {
        currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
        updateModalView();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!modal || modal.style.display !== 'flex') return;
    if (e.key === 'Escape') closeImageModal();
    if (e.key === 'ArrowLeft' && currentModalImages.length > 1) {
      currentModalIndex = (currentModalIndex - 1 + currentModalImages.length) % currentModalImages.length;
      updateModalView();
    }
    if (e.key === 'ArrowRight' && currentModalImages.length > 1) {
      currentModalIndex = (currentModalIndex + 1) % currentModalImages.length;
      updateModalView();
    }
  });

  // Filter & Search Logic
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const statusVal = statusFilter ? statusFilter.value.toLowerCase() : 'all';
    const catVal = categoryFilter ? categoryFilter.value.toLowerCase() : 'all';

    rows.forEach((row) => {
      const textContent = row.textContent.toLowerCase();
      const rowStatus = (row.getAttribute('data-status') || '').toLowerCase();
      const rowCat = (row.getAttribute('data-category') || '').toLowerCase();

      const matchesSearch = !query || textContent.includes(query);
      const matchesStatus = statusVal === 'all' || rowStatus.includes(statusVal);
      const matchesCat = catVal === 'all' || rowCat.includes(catVal);

      row.style.display = (matchesSearch && matchesStatus && matchesCat) ? '' : 'none';
    });
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = 'all';
      if (categoryFilter) categoryFilter.value = 'all';
      applyFilters();
    });
  }
}

// Utility Helpers
function getBadgeClass(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('pending')) return 'badge-pending';
  if (s.includes('progress')) return 'badge-progress';
  if (s.includes('resolved')) return 'badge-resolved';
  return 'badge-pending';
}

function setElemText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text || '—';
}

function escapeHtml(string) {
  if (!string) return '';
  const div = document.createElement('div');
  div.textContent = string;
  return div.innerHTML;
}
