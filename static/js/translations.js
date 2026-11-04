/**
 * CivicConnect Multilingual Translation Engine
 * Supported Languages:
 *   - English (en) [Default]
 *   - हिन्दी / Hindi (hi)
 *   - தமிழ் / Tamil (ta)
 *   - ಕನ್ನಡ / Kannada (kn)
 *
 * Provides instant zero-lag UI translation with original English preservation,
 * seamless multi-language switching, and Groq AI translation for dynamic content.
 */

(function () {
  'use strict';

  const LANG_NAMES = {
    en: 'English',
    hi: 'हिन्दी (Hindi)',
    ta: 'தமிழ் (Tamil)',
    kn: 'ಕನ್ನಡ (Kannada)'
  };

  const DICTS = {
    hi: {
      // Common Navigation & Header
      "CivicConnect": "सिविककनेक्ट",
      "Citizen Grievance Support": "नागरिक शिकायत समाधान प्रणाली",
      "File a Complaint": "शिकायत दर्ज करें",
      "Track a Complaint": "शिकायत ट्रैक करें",
      "Track Complaint Status": "शिकायत की स्थिति ट्रैक करें",
      "Department Dashboard": "विभाग संचालन डैशबोर्ड",
      "Officer Dashboard": "अधिकारी डैशबोर्ड",
      "Officer Portal": "अधिकारी पोर्टल",
      "Municipal Staff & Officer Portal": "नगर निगम अधिकारी पोर्टल",
      "Sign Out": "लॉग आउट",
      "Active": "सक्रिय",
      "Staff": "अधिकारी",

      // Page 1: File Complaint Headings & Steps
      "File a Civic Complaint": "नागरिक शिकायत दर्ज करें",
      "Report a civic issue in your locality to alert the municipal department and receive an instant reference number to track its progress.": "अपने क्षेत्र की नागरिक समस्या की सूचना दें जिससे संबंधित नगर निगम विभाग को सतर्क किया जा सके और स्थिति ट्रैक करने हेतु तुरंत संदर्भ नंबर मिल सके।",
      "Issue Details": "समस्या विवरण",
      "Location & Info": "स्थान एवं विवरण",
      "Reference ID": "संदर्भ संख्या",
      "Complaint Submission Form": "शिकायत पंजीकरण फॉर्म",
      "Fields indicated with an asterisk": "तारांकित फ़ील्ड",
      "are required to investigate the issue.": "जांच हेतु अनिवार्य हैं।",
      "Please correct the highlighted information": "कृपया हाइलाइट की गई जानकारी सुधारें",
      "One or more fields have errors. Please review the highlighted fields below before submitting.": "एक या अधिक फ़ील्ड में त्रुटि है। कृपया सबमिट करने से पहले जांच लें।",

      // Form Labels & Field Names (Exact Page 1 Match)
      "Complaint Category": "शिकायत श्रेणी",
      "Location or Landmark": "स्थान या लैंडमार्क",
      "Location / Landmark": "स्थान या लैंडमार्क",
      "Location Summary": "स्थान विवरण",
      "Complaint Description": "शिकायत का विवरण",
      "Detailed Complaint Description": "शिकायत का विस्तृत विवरण",
      "Your Name": "आपका नाम",
      "Your Full Name": "आपका पूरा नाम",
      "Mobile Phone": "मोबाइल फोन",
      "Mobile Phone Number": "मोबाइल फोन नंबर",
      "Optional": "वैकल्पिक",
      "Optional — allows officers to follow up": "वैकल्पिक — अधिकारी आपसे संपर्क कर सकेंगे",
      "Optional — for receiving SMS status updates": "वैकल्पिक — एसएमएस द्वारा अपडेट प्राप्त करने हेतु",
      "Submit Complaint": "शिकायत सबमिट करें",
      "Submit Grievance": "शिकायत सबमिट करें",

      // GPS Location & Map Picker
      "Use My Current Location": "मेरा वर्तमान स्थान उपयोग करें",
      "Use My Current GPS Location": "मेरा वर्तमान जीपीएस स्थान उपयोग करें",
      "Use Current Location": "मेरा वर्तमान स्थान उपयोग करें",
      "Re-detect My Location": "पुनः स्थान का पता लगाएं",
      "Re-detect My GPS Location": "पुनः जीपीएस स्थान का पता लगाएं",
      "Detecting your location...": "आपका स्थान खोजा जा रहा है...",
      "Requesting GPS access...": "जीपीएस अनुमति का अनुरोध किया जा रहा है...",
      "Resolving address...": "पता खोजा जा रहा है...",
      "Location detected successfully!": "स्थान सफलतापूर्वक मिल गया!",

      // Proof Images Upload (Mandatory, max 6)
      "Upload Images": "तस्वीरें अपलोड करें",
      "Upload Proof Images": "प्रमाण स्वरूप तस्वीरें अपलोड करें",
      "Click to select or drag & drop images here": "तस्वीरें चुनने के लिए क्लिक करें या यहाँ खींचकर छोड़ें",
      "Click to select or drag and drop images here": "तस्वीरें चुनने के लिए क्लिक करें या यहाँ खींचकर छोड़ें",
      "JPG, PNG, or WebP • Max 6 images • Each file ≤ 5 MB": "JPG, PNG या WebP • अधिकतम 6 तस्वीरें • प्रत्येक फ़ाइल ≤ 5 MB",
      "JPG, PNG, or WebP • Max 6 images • Each file <= 5 MB": "JPG, PNG या WebP • अधिकतम 6 तस्वीरें • प्रत्येक फ़ाइल ≤ 5 MB",
      "Upload 1–6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).": "नागरिक समस्या के प्रमाण के रूप में 1–6 तस्वीरें अपलोड करें (उदा. गड्ढा, टूटी पाइप, कचरा ढेर)।",
      "Upload 1-6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).": "नागरिक समस्या के प्रमाण के रूप में 1–6 तस्वीरें अपलोड करें (उदा. गड्ढा, टूटी पाइप, कचरा ढेर)।",
      "Please upload at least one proof image.": "कृपया कम से कम एक प्रमाण तस्वीर अपलोड करें।",
      "You can upload a maximum of 6 images.": "आप अधिकतम 6 तस्वीरें अपलोड कर सकते हैं।",
      "Only JPG, PNG, or WebP images are allowed. Remove invalid files.": "केवल JPG, PNG या WebP तस्वीरों की अनुमति है। अमान्य फ़ाइलें हटाएं।",
      "exceeds 5 MB. Please use a smaller image.": "5 MB से अधिक है। कृपया छोटी फ़ाइल चुनें।",

      // Department Evidence & Photo Viewer
      "Evidence": "साक्ष्य",
      "Uploaded Proof Evidence": "अपलोड किए गए साक्ष्य फोटो",
      "Inspect Evidence Photo": "साक्ष्य तस्वीर का निरीक्षण करें",
      "Evaluating reported civic grievance severity": "शिकायत की गंभीरता का मूल्यांकन",
      "Close Preview": "पूर्वावलोकन बंद करें",
      "Open Full Resolution": "मूल आकार में खोलें",
      "No photographic proof attached to this ticket.": "इस शिकायत के साथ कोई साक्ष्य तस्वीर संलग्न नहीं है।",
      "Click any photo thumbnail to inspect full high-resolution image in new tab.": "तस्वीर को बड़ा करके देखने हेतु किसी भी थंबनेल पर क्लिक करें।",
      "photos": "तस्वीरें",
      "photo": "तस्वीर",
      "None": "कोई नहीं",
      "View": "देखें",
      "Photo": "तस्वीर",

      // Form Hints & Error Messages
      "Selecting the correct category routes your complaint directly to the responsible division.": "सही श्रेणी चुनने से आपकी शिकायत सीधे संबंधित विभाग तक पहुँचती है।",
      "Provide the street name, cross, landmark, sector, or ward number within India.": "सड़क का नाम, निकटतम लैंडमार्क, सेक्टर या वार्ड नंबर दर्ज करें।",
      "Location or area is required so the field team can inspect the site.": "स्थान अनिवार्य है ताकि फील्ड टीम स्थल का निरीक्षण कर सके।",
      "Do not include passwords, payment information, or sensitive personal data.": "पासवर्ड, भुगतान या संवेदनशील व्यक्तिगत डेटा शामिल न करें।",
      "Please provide a short description of the issue.": "कृपया समस्या का संक्षिप्त विवरण प्रदान करें।",
      "Leave blank to file completely anonymously.": "गुमनाम शिकायत दर्ज करने हेतु इसे खाली छोड़ें।",
      "Optional for SMS updates. Must be a valid 10-digit Indian number if entered.": "एसएमएस अपडेट हेतु वैकल्पिक। दर्ज करने पर 10 अंकों का वैध भारतीय नंबर होना चाहिए।",
      "Privacy Reassurance:": "गोपनीयता आश्वासन:",
      "You can submit complaints anonymously. Optional personal details are stored solely for civic status notifications and are never made public.": "आप गुमनाम शिकायत दर्ज कर सकते हैं। व्यक्तिगत विवरण केवल स्थिति सूचना हेतु सुरक्षित रखे जाते हैं और सार्वजनिक नहीं किए जाते।",

      // Category Dropdown Options
      "Roads, Potholes & Footpaths": "सड़कें, गड्ढे एवं फुटपाथ",
      "Drainage, Sewage & Stormwater": "जल निकासी, सीवरेज एवं वर्षा जल",
      "Water Supply & Pipeline Quality": "जलापूर्ति एवं पाइपलाइन गुणवत्ता",
      "Waste Collection & Garbage Dumps": "कचरा संग्रहण एवं डंपिंग",
      "Streetlights & Public Electrical Poles": "स्ट्रीट लाइट एवं बिजली के खंभे",
      "Parks, Playgrounds & Trees": "पार्क, खेल मैदान एवं वृक्ष",
      "Noise Disturbance & Public Nuisance": "ध्वनि प्रदूषण एवं सार्वजनिक अशांति",
      "Public Bus Stops & Traffic Hazards": "बस स्टॉप एवं यातायात खतरे",
      "Other Civic Issues": "अन्य नागरिक समस्याएं",
      "Deforestation & Illegal Tree Felling": "अवैध वृक्ष कटाई एवं वनों की कटाई",
      "Deforestation / Environment": "वनों की कटाई / पर्यावरण",

      // Success State
      "Complaint Successfully Filed!": "शिकायत सफलतापूर्वक दर्ज की गई!",
      "Your civic grievance has been registered and routed to the municipal triage queue. Please save your reference number to track progress.": "आपकी शिकायत पंजीकृत हो चुकी है और संबंधित विभाग को भेज दी गई है। कृपया संदर्भ नंबर सहेज लें।",
      "Your Unique Tracking Reference": "आपकी विशिष्ट ट्रैकिंग संदर्भ संख्या",
      "Copy Reference": "संदर्भ कॉपी करें",
      "Estimated First Response": "अनुमानित प्रथम प्रतिक्रिया",
      "Within 48 Hours": "48 घंटे के भीतर",
      "Track This Complaint Now": "शिकायत अभी ट्रैक करें",
      "File Another Issue": "दूसरी शिकायत दर्ज करें",

      // Track Page
      "Enter your reference number to view real-time department updates, field inspection notes, and current resolution progress.": "विभागीय प्रगति, जमीनी निरीक्षण और वर्तमान स्थिति देखने के लिए अपना संदर्भ नंबर दर्ज करें।",
      "Complaint Reference Number": "शिकायत संदर्भ संख्या",
      "Check Status": "स्थिति जांचें",
      "Format: CC-YYYY-XXXX (e.g. CC-2026-8942)": "प्रारूप: CC-YYYY-XXXX (उदा. CC-2026-8942)",
      "Try sample: CC-2026-8942": "नमूना देखें: CC-2026-8942",
      "Use Sample Reference CC-2026-8942": "नमूना संदर्भ CC-2026-8942 आज़माएं",
      "Looking for an update on your complaint?": "अपनी शिकायत की स्थिति जानना चाहते हैं?",
      "Where can I find my reference number?": "संदर्भ संख्या कहाँ मिलेगी?",
      "Print Status": "स्थिति प्रिंट करें",
      "Resolution Progress Timeline": "समाधान प्रगति समयरेखा",
      "Official Department Dispatch & Resolution Notes": "विभागीय फील्ड टीम एवं अधिकारी की आधिकारिक टिप्पणी",
      "Citizen's Description": "नागरिक द्वारा दर्ज विवरण",
      "Citizen's Statement": "नागरिक का विवरण",
      "Submitted On": "दर्ज करने की तिथि",
      "Assigned to:": "सौंपा गया विभाग:",
      "Assigned Enforcement Authority:": "संबंधित प्रवर्तन प्राधिकरण:",
      "Applicable Statutory Act:": "लागू कानूनी अधिनियम:",
      "📋 How This Grievance Is Monitored & Inspected On Ground:": "📋 जमीनी स्तर पर इस शिकायत की निगरानी और जांच कैसे होगी:",
      "Reference Number Not Found": "संदर्भ संख्या नहीं मिली",
      "File a New Complaint": "नई शिकायत दर्ज करें",

      // Status Badges
      "Pending Review": "समीक्षा लंबित",
      "In Progress": "प्रक्रियाधीन",
      "Resolved": "निस्तारित",
      "Received": "प्राप्त",
      "Completed": "पूर्ण",

      // Department Dashboard & Login
      "Department Operations Dashboard": "विभाग संचालन डैशबोर्ड",
      "Department Staff Dashboard": "विभाग कर्मचारी डैशबोर्ड",
      "Total Grievances": "कुल शिकायतें",
      "Awaiting field triage": "फील्ड जांच हेतु प्रतीक्षारत",
      "Crews dispatched on site": "फील्ड टीम मौके पर तैनात",
      "Fully inspected & closed": "सत्यापित एवं कार्य पूर्ण",
      "All submitted complaints": "सभी दर्ज शिकायतें",
      "Update Status & Dispatch Notes": "स्थिति एवं फील्ड निर्देश अपडेट करें",
      "Change Complaint Status": "शिकायत की स्थिति बदलें",
      "Officer Update / Public Resolution Note": "अधिकारी की टिप्पणी / सार्वजनिक नोट",
      "Save & Notify Citizen": "सुरक्षित करें एवं नागरिक को सूचित करें",
      "All Categories": "सभी श्रेणियां",
      "Filter by Category": "श्रेणी अनुसार छांटें",
      "Municipal Officer Portal": "नगर निगम अधिकारी पोर्टल",
      "Restricted to authorized municipal inspectors, tree authority officers, and civic division engineers.": "केवल अधिकृत नगर निगम निरीक्षकों, वृक्ष प्राधिकरण अधिकारियों एवं अभियंताओं के लिए सुरक्षित।",
      "Officer Email or Badge ID": "अधिकारी ईमेल या बैज आईडी",
      "Official Password": "आधिकारिक पासवर्ड",
      "Verify & Access Dashboard": "सत्यापित करें एवं डैशबोर्ड खोलें",
      "⚡ Quick-Select Demo Officer (1-Click Test):": "⚡ त्वरित डेमो अधिकारी चयन (1-क्लिक परीक्षण):",
      "Are you a resident?": "क्या आप नागरिक हैं?",
      "Track your complaint here": "शिकायत यहाँ ट्रैक करें",
      "File a new grievance": "नई शिकायत दर्ज करें",
      "Quick Navigation": "त्वरित नेविगेशन"
    },

    ta: {
      // Common Navigation & Header
      "CivicConnect": "சிவிக்கனெக்ட்",
      "Citizen Grievance Support": "குடிமக்கள் குறைதீர்க்கும் தளம்",
      "File a Complaint": "புகார் பதிவு செய்க",
      "Track a Complaint": "புகாரை கண்காணிக்கவும்",
      "Track Complaint Status": "புகாரின் நிலையை கண்காணிக்கவும்",
      "Department Dashboard": "துறை செயல்பாட்டு பலகை",
      "Officer Dashboard": "அதிகாரி பலகை",
      "Officer Portal": "அதிகாரி நுழைவாயில்",
      "Municipal Staff & Officer Portal": "நகராட்சி அதிகாரி நுழைவாயில்",
      "Sign Out": "வெளியேறு",
      "Active": "செயலில்",
      "Staff": "பணியாளர்",

      // Page 1: File Complaint Headings & Steps
      "File a Civic Complaint": "குடிமக்கள் புகார் பதிவு",
      "Report a civic issue in your locality to alert the municipal department and receive an instant reference number to track its progress.": "உங்கள் பகுதியில் உள்ள பிரச்சனையை நகராட்சிக்கு தெரிவிக்கவும், அதன் நிலையை கண்காணிக்க உடனடி குறிப்பு எண்ணைப் பெறவும்.",
      "Issue Details": "பிரச்சனை விவரம்",
      "Location & Info": "இடம் மற்றும் தகவல்",
      "Reference ID": "குறிப்பு எண்",
      "Complaint Submission Form": "புகார் பதிவு படிவம்",
      "Fields indicated with an asterisk": "நட்சத்திர குறியிட்ட புலங்கள்",
      "are required to investigate the issue.": "விசாரணைக்கு கட்டாயமானவை.",
      "Please correct the highlighted information": "தயவுசெய்து சிறப்பித்துக் காட்டப்பட்ட தகவலை சரிசெய்யவும்",
      "One or more fields have errors. Please review the highlighted fields below before submitting.": "ஒன்று அல்லது அதற்கு மேற்பட்ட இடங்களில் பிழைகள் உள்ளன. சமர்ப்பிக்கும் முன் சரிபார்க்கவும்.",

      // Form Labels & Field Names (Exact Page 1 Match)
      "Complaint Category": "புகார் வகை",
      "Location or Landmark": "இடம் அல்லது அடையாளக்குறி",
      "Location / Landmark": "இடம் அல்லது அடையாளக்குறி",
      "Location Summary": "இட விவரம்",
      "Complaint Description": "புகார் விளக்கம்",
      "Detailed Complaint Description": "விரிவான புகார் விளக்கம்",
      "Your Name": "உங்கள் பெயர்",
      "Your Full Name": "உங்கள் முழு பெயர்",
      "Mobile Phone": "கைபேசி எண்",
      "Mobile Phone Number": "கைபேசி எண்",
      "Optional": "விருப்பத்தேர்வு",
      "Optional — allows officers to follow up": "விருப்பத்தேர்வு — அதிகாரிகள் தொடர்பு கொள்ள உதவும்",
      "Optional — for receiving SMS status updates": "விருப்பத்தேர்வு — எஸ்எம்எஸ் மூலம் நிலை அறிய உதவும்",
      "Submit Complaint": "புகாரை சமர்ப்பிக்கவும்",
      "Submit Grievance": "புகாரை சமர்ப்பிக்கவும்",

      // GPS Location & Map Picker
      "Use My Current Location": "எனது தற்போதைய இருப்பிடத்தைப் பயன்படுத்துக",
      "Use My Current GPS Location": "எனது தற்போதைய ஜி.பி.எஸ் இருப்பிடத்தைப் பயன்படுத்துக",
      "Use Current Location": "எனது தற்போதைய இருப்பிடத்தைப் பயன்படுத்துக",
      "Re-detect My Location": "இருப்பிடத்தை மீண்டும் கண்டறிக",
      "Re-detect My GPS Location": "எனது ஜி.பி.எஸ் இருப்பிடத்தை மீண்டும் கண்டறிக",
      "Detecting your location...": "உங்கள் இருப்பிடம் கண்டறியப்படுகிறது...",
      "Requesting GPS access...": "ஜிபிஎஸ் அனுமதி கோரப்படுகிறது...",
      "Resolving address...": "முகவரி கண்டறியப்படுகிறது...",
      "Location detected successfully!": "இருப்பிடம் வெற்றிகரமாக கண்டறியப்பட்டது!",

      // Proof Images Upload (Mandatory, max 6)
      "Upload Images": "புகைப்படங்களை பதிவேற்றவும்",
      "Upload Proof Images": "ஆதார புகைப்படங்களை பதிவேற்றவும்",
      "Click to select or drag & drop images here": "படங்களைத் தேர்ந்தெடுக்க கிளிக் செய்யவும் அல்லது இங்கே இழுத்து விடவும்",
      "Click to select or drag and drop images here": "படங்களைத் தேர்ந்தெடுக்க கிளிக் செய்யவும் அல்லது இங்கே இழுத்து விடவும்",
      "JPG, PNG, or WebP • Max 6 images • Each file ≤ 5 MB": "JPG, PNG அல்லது WebP • அதிகபட்சம் 6 படங்கள் • ஒவ்வொரு கோப்பும் ≤ 5 MB",
      "JPG, PNG, or WebP • Max 6 images • Each file <= 5 MB": "JPG, PNG அல்லது WebP • அதிகபட்சம் 6 படங்கள் • ஒவ்வொரு கோப்பும் ≤ 5 MB",
      "Upload 1–6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).": "குடிமைப் பிரச்சனையின் ஆதாரமாக 1–6 புகைப்படங்களை பதிவேற்றவும் (எ.கா. குழி, உடைந்த குழாய், குப்பை மேடு).",
      "Upload 1-6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).": "குடிமைப் பிரச்சனையின் ஆதாரமாக 1–6 புகைப்படங்களை பதிவேற்றவும் (எ.கா. குழி, உடைந்த குழாய், குப்பை மேடு).",
      "Please upload at least one proof image.": "குறைந்தது ஒரு ஆதாரப் படத்தையாவது பதிவேற்றவும்.",
      "You can upload a maximum of 6 images.": "அதிகபட்சம் 6 படங்களை மட்டுமே பதிவேற்ற முடியும்.",
      "Only JPG, PNG, or WebP images are allowed. Remove invalid files.": "JPG, PNG அல்லது WebP படங்கள் மட்டுமே அனுமதிக்கப்படுகின்றன. தவறான கோப்புகளை நீக்கவும்.",
      "exceeds 5 MB. Please use a smaller image.": "5 MB ஐ விட அதிகமாக உள்ளது. சிறிய படத்தை தேர்ந்தெடுக்கவும்.",

      // Department Evidence & Photo Viewer
      "Evidence": "ஆதாரம்",
      "Uploaded Proof Evidence": "பதிவேற்றப்பட்ட ஆதாரப் புகைப்படங்கள்",
      "Inspect Evidence Photo": "ஆதாரப் படத்தை ஆய்வு செய்க",
      "Evaluating reported civic grievance severity": "புகாரின் தீவிரத்தை மதிப்பீடு செய்தல்",
      "Close Preview": "முன்னோட்டத்தை மூடுக",
      "Open Full Resolution": "முழு தெளிவுத்திறனில் திறக்கவும்",
      "No photographic proof attached to this ticket.": "இந்த புகாருடன் எந்த புகைப்பட ஆதாரமும் இணைக்கப்படவில்லை.",
      "Click any photo thumbnail to inspect full high-resolution image in new tab.": "முழு படத்தைப் பார்க்க எந்த புகைப்பட சிறுபடத்தையும் கிளிக் செய்யவும்.",
      "photos": "படங்கள்",
      "photo": "படம்",
      "None": "ஏதுமில்லை",
      "View": "பார்க்க",
      "Photo": "படம்",

      // Form Hints & Error Messages
      "Selecting the correct category routes your complaint directly to the responsible division.": "சரியான வகையைத் தேர்ந்தெடுப்பது உங்கள் புகாரை நேரடியாக உரிய துறைக்கு அனுப்பும்.",
      "Provide the street name, cross, landmark, sector, or ward number within India.": "தெரு பெயர், குறுக்குத் தெரு, அடையாளக்குறி அல்லது வார்டு எண்ணை வழங்கவும்.",
      "Location or area is required so the field team can inspect the site.": "களக் குழுவினர் ஆய்வு செய்ய இடம் கட்டாயம் தேவை.",
      "Do not include passwords, payment information, or sensitive personal data.": "கடவுச்சொற்கள், வங்கி விவரங்கள் போன்றவற்றை உள்ளிட வேண்டாம்.",
      "Please provide a short description of the issue.": "பிரச்சனை பற்றிய சுருக்கமான விளக்கத்தை உள்ளிடவும்.",
      "Leave blank to file completely anonymously.": "பெயரின்றி புகார் செய்ய இதை காலியாக விடவும்.",
      "Optional for SMS updates. Must be a valid 10-digit Indian number if entered.": "எஸ்எம்எஸ் பெற விரும்பினால் 10 இலக்க இந்திய எண்ணை உள்ளிடவும்.",
      "Privacy Reassurance:": "தனியுரிமை உத்தரவாதம்:",
      "You can submit complaints anonymously. Optional personal details are stored solely for civic status notifications and are never made public.": "நீங்கள் அநாமதேயமாக புகார் செய்யலாம். தனிப்பட்ட தகவல்கள் நிலை அறிக்கைக்காக மட்டுமே பயன்படும், பொதுவில் பகிரப்படாது.",

      // Category Dropdown Options
      "Roads, Potholes & Footpaths": "சாலைகள், குழிகள் மற்றும் நடைபாதைகள்",
      "Drainage, Sewage & Stormwater": "வடிகால், கழிவுநீர் மற்றும் மழைநீர்",
      "Water Supply & Pipeline Quality": "குடிநீர் வழங்கல் மற்றும் குழாய் தரம்",
      "Waste Collection & Garbage Dumps": "குப்பை சேகரிப்பு மற்றும் கழிவு மேலாண்மை",
      "Streetlights & Public Electrical Poles": "தெருவிளக்குகள் மற்றும் மின் கம்பங்கள்",
      "Parks, Playgrounds & Trees": "பூங்காக்கள், விளையாட்டு மைதானங்கள் மற்றும் மரங்கள்",
      "Noise Disturbance & Public Nuisance": "ஒலி மாசுபாடு மற்றும் பொது தொல்லை",
      "Public Bus Stops & Traffic Hazards": "பேருந்து நிறுத்தங்கள் மற்றும் போக்குவரத்து ஆபத்துகள்",
      "Other Civic Issues": "பிற குடிமைப் பிரச்சனைகள்",
      "Deforestation & Illegal Tree Felling": "சட்டவிரோத மரம் வெட்டுதல் மற்றும் காடழிப்பு",
      "Deforestation / Environment": "காடழிப்பு / சுற்றுச்சூழல்",

      // Success State
      "Complaint Successfully Filed!": "புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது!",
      "Your civic grievance has been registered and routed to the municipal triage queue. Please save your reference number to track progress.": "உங்கள் புகார் பதிவு செய்யப்பட்டு துறைக்கு அனுப்பப்பட்டுள்ளது. கண்காணிக்க உங்கள் குறிப்பு எண்ணை குறித்துக் கொள்ளவும்.",
      "Your Unique Tracking Reference": "உங்கள் பிரத்யேக கண்காணிப்பு குறிப்பு எண்",
      "Copy Reference": "குறிப்பு எண்ணை நகலெடுக்கவும்",
      "Estimated First Response": "முதல் பதில் எதிர்பார்க்கப்படும் நேரம்",
      "Within 48 Hours": "48 மணி நேரத்திற்குள்",
      "Track This Complaint Now": "இப்போது புகாரை கண்காணிக்கவும்",
      "File Another Issue": "மற்றொரு புகாரை பதிவு செய்க",

      // Track Page
      "Enter your reference number to view real-time department updates, field inspection notes, and current resolution progress.": "துறை முன்னேற்றம், கள ஆய்வு மற்றும் தீர்வு நிலையை அறிய உங்கள் குறிப்பு எண்ணை உள்ளிடவும்.",
      "Complaint Reference Number": "புகார் குறிப்பு எண்",
      "Check Status": "நிலையை சரிபார்க்கவும்",
      "Format: CC-YYYY-XXXX (e.g. CC-2026-8942)": "வடிவம்: CC-YYYY-XXXX (எ.கா. CC-2026-8942)",
      "Try sample: CC-2026-8942": "மாதிரி குறிப்பு: CC-2026-8942",
      "Use Sample Reference CC-2026-8942": "மாதிரி எண் CC-2026-8942 முயற்சிக்கவும்",
      "Looking for an update on your complaint?": "உங்கள் புகாரின் நிலையை அறிய வேண்டுமா?",
      "Where can I find my reference number?": "எனது குறிப்பு எண் எங்கே கிடைக்கும்?",
      "Print Status": "அச்சிடுக",
      "Resolution Progress Timeline": "தீர்வு முன்னேற்ற காலவரிசை",
      "Official Department Dispatch & Resolution Notes": "துறை கள ஆய்வு மற்றும் அதிகாரியின் அதிகாரப்பூர்வ குறிப்பு",
      "Citizen's Description": "குடிமகன் பதிவு செய்த விவரம்",
      "Citizen's Statement": "குடிமகனின் அறிக்கை",
      "Submitted On": "சமர்ப்பிக்கப்பட்ட நாள்",
      "Assigned to:": "ஒதுக்கப்பட்ட துறை:",
      "Assigned Enforcement Authority:": "சம்பந்தப்பட்ட அமலாக்க அதிகாரம்:",
      "Applicable Statutory Act:": "பொருந்தக்கூடிய சட்ட விதிகள்:",
      "📋 How This Grievance Is Monitored & Inspected On Ground:": "📋 களத்தில் இந்த புகார் எவ்வாறு கண்காணிக்கப்பட்டு ஆய்வு செய்யப்படுகிறது:",
      "Reference Number Not Found": "குறிப்பு எண் கிடைக்கவில்லை",
      "File a New Complaint": "புதிய புகாரைப் பதிவு செய்யவும்",

      // Status Badges
      "Pending Review": "மதிப்பாய்வு நிலுவையில்",
      "In Progress": "செயல்பாட்டில் உள்ளது",
      "Resolved": "தீர்க்கப்பட்டது",
      "Received": "பெறப்பட்டது",
      "Completed": "நிறைவுற்றது",

      // Department Dashboard & Login
      "Department Operations Dashboard": "துறை செயல்பாட்டு பலகை",
      "Department Staff Dashboard": "துறை பணியாளர் பலகை",
      "Total Grievances": "மொத்த புகார்கள்",
      "Awaiting field triage": "கள ஆய்வுக்கு காத்திருக்கிறது",
      "Crews dispatched on site": "களப் பணியாளர்கள் அனுப்பப்பட்டுள்ளனர்",
      "Fully inspected & closed": "முழுமையாக ஆய்வு செய்யப்பட்டு மூடப்பட்டது",
      "All submitted complaints": "சமர்ப்பிக்கப்பட்ட அனைத்து புகார்கள்",
      "Update Status & Dispatch Notes": "நிலை மற்றும் கள குறிப்புகளைப் புதுப்பிக்கவும்",
      "Change Complaint Status": "புகார் நிலையை மாற்றவும்",
      "Officer Update / Public Resolution Note": "அதிகாரி குறிப்பு / தீர்வு தகவல்",
      "Save & Notify Citizen": "சேமித்து குடிமகனுக்கு தெரிவிக்கவும்",
      "All Categories": "அனைத்து வகைகள்",
      "Filter by Category": "வகை வாரியாக வடிகட்டவும்",
      "Municipal Officer Portal": "நகராட்சி அதிகாரி நுழைவாயில்",
      "Restricted to authorized municipal inspectors, tree authority officers, and civic division engineers.": "அங்கீகரிக்கப்பட்ட நகராட்சி ஆய்வாளர்கள் மற்றும் அதிகாரிகளுக்கு மட்டுமே அனுமதிக்கப்பட்டது.",
      "Officer Email or Badge ID": "அதிகாரி மின்னஞ்சல் அல்லது பேட்ஜ் எண்",
      "Official Password": "கடவுச்சொல்",
      "Verify & Access Dashboard": "சரிபார்த்து பலகையைத் திறக்கவும்",
      "⚡ Quick-Select Demo Officer (1-Click Test):": "⚡ மாதிரி அதிகாரியைத் தேர்ந்தெடுக்கவும் (1-கிளிக் சோதனை):",
      "Are you a resident?": "நீங்கள் குடியிருப்பாளரா?",
      "Track your complaint here": "உங்கள் புகாரை இங்கே கண்காணிக்கவும்",
      "File a new grievance": "புதிய புகாரைப் பதிவு செய்க",
      "Quick Navigation": "விரைவு வழிசெலுத்தல்"
    },

    kn: {
      // Common Navigation & Header
      "CivicConnect": "ಸಿವಿಕ್‌ಕನೆಕ್ಟ್",
      "Citizen Grievance Support": "ನಾಗರಿಕ ಕುಂದುಕೊರತೆ ಪರಿಹಾರ ವೇದಿಕೆ",
      "File a Complaint": "ದೂರು ದಾಖಲಿಸಿ",
      "Track a Complaint": "ದೂರಿನ ಸ್ಥಿತಿ ತಿಳಿಯಿರಿ",
      "Track Complaint Status": "ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "Department Dashboard": "ಇಲಾಖಾ ಕಾರ್ಯಾಚರಣೆ ಫಲಕ",
      "Officer Dashboard": "ಅಧಿಕಾರಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
      "Officer Portal": "ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್",
      "Municipal Staff & Officer Portal": "ನಗರ ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್",
      "Sign Out": "ನಿರ್ಗಮಿಸಿ",
      "Active": "ಸಕ್ರಿಯ",
      "Staff": "ಸಿಬ್ಬಂದಿ",

      // Page 1: File Complaint Headings & Steps
      "File a Civic Complaint": "ನಾಗರಿಕ ದೂರು ದಾಖಲಿಸಿ",
      "Report a civic issue in your locality to alert the municipal department and receive an instant reference number to track its progress.": "ನಿಮ್ಮ ಪ್ರದೇಶದ ಸಮಸ್ಯೆಯನ್ನು ನಗರ ಪಾಲಿಕೆಗೆ ವರದಿ ಮಾಡಿ ಮತ್ತು ಪರಿಹಾರದ ಪ್ರಗತಿ ತಿಳಿಯಲು ತಕ್ಷಣದ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಪಡೆಯಿರಿ.",
      "Issue Details": "ಸಮಸ್ಯೆಯ ವಿವರ",
      "Location & Info": "ಸ್ಥಳ ಮತ್ತು ಮಾಹಿತಿ",
      "Reference ID": "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",
      "Complaint Submission Form": "ದೂರು ಸಲ್ಲಿಕೆ ನಮೂನೆ",
      "Fields indicated with an asterisk": "ನಕ್ಷತ್ರ ಗುರುತಿಸಲಾದ ವಿವರಗಳು",
      "are required to investigate the issue.": "ತಪಾಸಣೆಗೆ ಕಡ್ಡಾಯವಾಗಿವೆ.",
      "Please correct the highlighted information": "ದಯವಿಟ್ಟು ಗುರುತಿಸಲಾದ ಮಾಹಿತಿಯನ್ನು ಸರಿಪಡಿಸಿ",
      "One or more fields have errors. Please review the highlighted fields below before submitting.": "ಕೆಲವು ವಿವರಗಳಲ್ಲಿ ದೋಷವಿದೆ. ಸಲ್ಲಿಸುವ ಮುನ್ನ ಪರಿಶೀಲಿಸಿ.",

      // Form Labels & Field Names (Exact Page 1 Match)
      "Complaint Category": "ದೂರಿನ ವರ್ಗ",
      "Location or Landmark": "ಸ್ಥಳ ಅಥವಾ ಪ್ರಮುಖ ಹೆಗ್ಗುರುತು",
      "Location / Landmark": "ಸ್ಥಳ ಅಥವಾ ಪ್ರಮುಖ ಹೆಗ್ಗುರುತು",
      "Location Summary": "ಸ್ಥಳದ ವಿವರ",
      "Complaint Description": "ದೂರಿನ ವಿವರಣೆ",
      "Detailed Complaint Description": "ದೂರಿನ ವಿವರವಾದ ವಿವರಣೆ",
      "Your Name": "ನಿಮ್ಮ ಹೆಸರು",
      "Your Full Name": "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು",
      "Mobile Phone": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      "Mobile Phone Number": "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
      "Optional": "ಐಚ್ಛಿಕ",
      "Optional — allows officers to follow up": "ಐಚ್ಛಿಕ — ಅಧಿಕಾರಿಗಳು ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲು ಸಹಾಯ ಮಾಡುತ್ತದೆ",
      "Optional — for receiving SMS status updates": "ಐಚ್ಛಿಕ — ಎಸ್‌ಎಂಎಸ್ ಮೂಲಕ ಸ್ಥಿತಿ ತಿಳಿಯಲು",
      "Submit Complaint": "ದೂರನ್ನು ಸಲ್ಲಿಸಿ",
      "Submit Grievance": "ದೂರನ್ನು ಸಲ್ಲಿಸಿ",

      // GPS Location & Map Picker
      "Use My Current Location": "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
      "Use My Current GPS Location": "ನನ್ನ ಪ್ರಸ್ತುತ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
      "Use Current Location": "ನನ್ನ ಪ್ರಸ್ತುತ ಸ್ಥಳವನ್ನು ಬಳಸಿ",
      "Re-detect My Location": "ಸ್ಥಳವನ್ನು ಮರು-ಪತ್ತೆ ಮಾಡಿ",
      "Re-detect My GPS Location": "ನನ್ನ ಜಿಪಿಎಸ್ ಸ್ಥಳವನ್ನು ಮರು-ಪತ್ತೆ ಮಾಡಿ",
      "Detecting your location...": "ನಿಮ್ಮ ಸ್ಥಳವನ್ನು ಪತ್ತೆ ಮಾಡಲಾಗುತ್ತಿದೆ...",
      "Requesting GPS access...": "ಜಿಪಿಎಸ್ ಅನುಮತಿ ವಿನಂತಿಸಲಾಗುತ್ತಿದೆ...",
      "Resolving address...": "ವಿಳಾಸವನ್ನು ಪಡೆಯಲಾಗುತ್ತಿದೆ...",
      "Location detected successfully!": "ಸ್ಥಳವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಪತ್ತೆಹಚ್ಚಲಾಗಿದೆ!",

      // Proof Images Upload (Mandatory, max 6)
      "Upload Images": "ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      "Upload Proof Images": "ಪುರಾವೆ ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",
      "Click to select or drag & drop images here": "ಚಿತ್ರಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿಗೆ ಎಳೆದು ಬಿಡಿ",
      "Click to select or drag and drop images here": "ಚಿತ್ರಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ ಅಥವಾ ಇಲ್ಲಿಗೆ ಎಳೆದು ಬಿಡಿ",
      "JPG, PNG, or WebP • Max 6 images • Each file ≤ 5 MB": "JPG, PNG ಅಥವಾ WebP • ಗರಿಷ್ಠ 6 ಚಿತ್ರಗಳು • ಪ್ರತಿ ಕಡತ ≤ 5 MB",
      "JPG, PNG, or WebP • Max 6 images • Each file <= 5 MB": "JPG, PNG ಅಥವಾ WebP • ಗರಿಷ್ಠ 6 ಚಿತ್ರಗಳು • ಪ್ರತಿ ಕಡತ ≤ 5 MB",
      "Upload 1–6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).": "ಸಮಸ್ಯೆಯ ಪುರಾವೆಯಾಗಿ 1–6 ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಉದಾ. ಗುಂಡಿ, ಒಡೆದ ಪೈಪ್, ಕಸದ ರಾಶಿ).",
      "Upload 1-6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).": "ಸಮಸ್ಯೆಯ ಪುರಾವೆಯಾಗಿ 1–6 ಫೋಟೋಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ (ಉದಾ. ಗುಂಡಿ, ಒಡೆದ ಪೈಪ್, ಕಸದ ರಾಶಿ).",
      "Please upload at least one proof image.": "ದಯವಿಟ್ಟು ಕನಿಷ್ಠ ಒಂದು ಪುರಾವೆ ಚಿತ್ರವನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
      "You can upload a maximum of 6 images.": "ನೀವು ಗರಿಷ್ಠ 6 ಚಿತ್ರಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಬಹುದು.",
      "Only JPG, PNG, or WebP images are allowed. Remove invalid files.": "JPG, PNG ಅಥವಾ WebP ಚಿತ್ರಗಳಿಗೆ ಮಾತ್ರ ಅನುಮತಿಸಲಾಗಿದೆ. ಅಮಾನ್ಯ ಕಡತಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.",
      "exceeds 5 MB. Please use a smaller image.": "5 MB ಗಿಂತ ಹೆಚ್ಚಾಗಿದೆ. ದಯವಿಟ್ಟು ಸಣ್ಣ ಕಡತವನ್ನು ಬಳಸಿ.",

      // Department Evidence & Photo Viewer
      "Evidence": "ಪುರಾವೆ",
      "Uploaded Proof Evidence": "ಅಪ್‌ಲೋಡ್ ಮಾಡಲಾದ ಪುರಾವೆ ಚಿತ್ರಗಳು",
      "Inspect Evidence Photo": "ಪುರಾವೆ ಚಿತ್ರವನ್ನು ಪರಿಶೀಲಿಸಿ",
      "Evaluating reported civic grievance severity": "ವರದಿ ಮಾಡಿದ ದೂರಿನ ಗಂಭೀರತೆಯ ಮೌಲ್ಯಮಾಪನ",
      "Close Preview": "ಮುನ್ನೋಟವನ್ನು ಮುಚ್ಚಿ",
      "Open Full Resolution": "ಪೂರ್ಣ ರೆಸಲ್ಯೂಶನ್‌ನಲ್ಲಿ ತೆರೆಯಿರಿ",
      "No photographic proof attached to this ticket.": "ಈ ದೂರಿಗೆ ಯಾವುದೇ ಫೋಟೋ ಪುರಾವೆ ಲಗತ್ತಿಸಲಾಗಿಲ್ಲ.",
      "Click any photo thumbnail to inspect full high-resolution image in new tab.": "ಪೂರ್ಣ ಚಿತ್ರವನ್ನು ನೋಡಲು ಯಾವುದೇ ಫೋಟೋ ಮೇಲೆ ಕ್ಲಿಕ್ ಮಾಡಿ.",
      "photos": "ಚಿತ್ರಗಳು",
      "photo": "ಚಿತ್ರ",
      "None": "ಯಾವುದೂ ಇಲ್ಲ",
      "View": "ನೋಡಿ",
      "Photo": "ಚಿತ್ರ",

      // Form Hints & Error Messages
      "Selecting the correct category routes your complaint directly to the responsible division.": "ಸರಿಯಾದ ವರ್ಗವನ್ನು ಆಯ್ಕೆ ಮಾಡುವುದರಿಂದ ನಿಮ್ಮ ದೂರು ನೇರವಾಗಿ ಸಂಬಂಧಪಟ್ಟ ಇಲಾಖೆಗೆ ತಲುಪುತ್ತದೆ.",
      "Provide the street name, cross, landmark, sector, or ward number within India.": "ಬೀದಿ ಹೆಸರು, ಕ್ರಾಸ್, ಪ್ರಮುಖ ಹೆಗ್ಗುರುತು ಅಥವಾ ವಾರ್ಡ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
      "Location or area is required so the field team can inspect the site.": "ಸಿಬ್ಬಂದಿ ಸ್ಥಳ ಪರಿಶೀಲನೆ ನಡೆಸಲು ಸ್ಥಳದ ಮಾಹಿತಿ ಕಡ್ಡಾಯವಾಗಿದೆ.",
      "Do not include passwords, payment information, or sensitive personal data.": "ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಅಥವಾ ಸೂಕ್ಷ್ಮ ವೈಯಕ್ತಿಕ ವಿವರಗಳನ್ನು ನಮೂದಿಸಬೇಡಿ.",
      "Please provide a short description of the issue.": "ದಯವಿಟ್ಟು ಸಮಸ್ಯೆಯ ಸಂಕ್ಷಿಪ್ತ ವಿವರಣೆ ನೀಡಿ.",
      "Leave blank to file completely anonymously.": "ಹೆಸರಿಲ್ಲದೆ ದೂರು ಸಲ್ಲಿಸಲು ಇದನ್ನು ಖಾಲಿ ಬಿಡಿ.",
      "Optional for SMS updates. Must be a valid 10-digit Indian number if entered.": "ಎಸ್‌ಎಂಎಸ್ ಅಪ್‌ಡೇಟ್ಸ್‌ಗಾಗಿ 10 ಅಂಕಿಗಳ ಮಾನ್ಯ ಭಾರತೀಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.",
      "Privacy Reassurance:": "ಗೌಪ್ಯತೆ ಭರವಸೆ:",
      "You can submit complaints anonymously. Optional personal details are stored solely for civic status notifications and are never made public.": "ನೀವು ಅನಾಮಧೇಯವಾಗಿ ದೂರು ಸಲ್ಲಿಸಬಹುದು. ವೈಯಕ್ತಿಕ ಮಾಹಿತಿಯನ್ನು ಕೇವಲ ಸ್ಥಿತಿ ತಿಳಿಸಲು ಮಾತ್ರ ಬಳಸಲಾಗುತ್ತದೆ.",

      // Category Dropdown Options
      "Roads, Potholes & Footpaths": "ರಸ್ತೆಗಳು, ಗುಂಡಿಗಳು ಮತ್ತು ಪಾದಚಾರಿ ಮಾರ್ಗಗಳು",
      "Drainage, Sewage & Stormwater": "ಒಳಚರಂಡಿ ಮತ್ತು ಮಳೆನೀರು",
      "Water Supply & Pipeline Quality": "ನೀರು ಸರಬರಾಜು ಮತ್ತು ಪೈಪ್‌ಲೈನ್ ಗುಣಮಟ್ಟ",
      "Waste Collection & Garbage Dumps": "ಕಸ ಸಂಗ್ರಹಣೆ ಮತ್ತು ತ್ಯಾಜ್ಯ ವಿಲೇವಾರಿ",
      "Streetlights & Public Electrical Poles": "ಬೀದಿ ದೀಪಗಳು ಮತ್ತು ವಿದ್ಯುತ್ ಕಂಬಗಳು",
      "Parks, Playgrounds & Trees": "ಉದ್ಯಾನವನಗಳು, ಆಟದ ಮೈದಾನಗಳು ಮತ್ತು ಮರಗಳು",
      "Noise Disturbance & Public Nuisance": "ಶಬ್ದ ಮಾಲಿನ್ಯ ಮತ್ತು ಸಾರ್ವಜನಿಕ ಉಪದ್ರವ",
      "Public Bus Stops & Traffic Hazards": "ಬಸ್ ನಿಲ್ದಾಣಗಳು ಮತ್ತು ಸಂಚಾರ ಅಪಾಯಗಳು",
      "Other Civic Issues": "ಇತರ ನಾಗರಿಕ ಸಮಸ್ಯೆಗಳು",
      "Deforestation & Illegal Tree Felling": "ಅನಧಿಕೃತ ಮರ ಕಡಿಯುವುದು ಮತ್ತು ಅರಣ್ಯನಾಶ",
      "Deforestation / Environment": "ಅರಣ್ಯನಾಶ / ಪರಿಸರ",

      // Success State
      "Complaint Successfully Filed!": "ದೂರನ್ನು ಯಶಸ್ವಿಯಾಗಿ ದಾಖಲಿಸಲಾಗಿದೆ!",
      "Your civic grievance has been registered and routed to the municipal triage queue. Please save your reference number to track progress.": "ನಿಮ್ಮ ದೂರು ದಾಖಲಾಗಿದೆ ಮತ್ತು ಇಲಾಖೆಗೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಪ್ರಗತಿ ತಿಳಿಯಲು ದಯವಿಟ್ಟು ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ಉಳಿಸಿಕೊಳ್ಳಿ.",
      "Your Unique Tracking Reference": "ನಿಮ್ಮ ಅನನ್ಯ ಟ್ರ್ಯಾಕಿಂಗ್ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",
      "Copy Reference": "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ನಕಲಿಸಿ",
      "Estimated First Response": "ಅಂದಾಜು ಮೊದಲ ಪ್ರತಿಕ್ರಿಯೆ",
      "Within 48 Hours": "48 ಗಂಟೆಗಳ ಒಳಗೆ",
      "Track This Complaint Now": "ದೂರನ್ನು ಈಗಲೇ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "File Another Issue": "ಮತ್ತೊಂದು ದೂರನ್ನು ದಾಖಲಿಸಿ",

      // Track Page
      "Enter your reference number to view real-time department updates, field inspection notes, and current resolution progress.": "ಇಲಾಖೆಯ ಪ್ರಗತಿ, ಸ್ಥಳ ಪರಿಶೀಲನೆ ಮತ್ತು ಪರಿಹಾರದ ಸ್ಥಿತಿಯನ್ನು ನೋಡಲು ನಿಮ್ಮ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ.",
      "Complaint Reference Number": "ದೂರಿನ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ",
      "Check Status": "ಸ್ಥಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ",
      "Format: CC-YYYY-XXXX (e.g. CC-2026-8942)": "ಮಾದರಿ: CC-YYYY-XXXX (ಉದಾ. CC-2026-8942)",
      "Try sample: CC-2026-8942": "ಮಾದರಿ ನೋಡಿ: CC-2026-8942",
      "Use Sample Reference CC-2026-8942": "ಮಾದರಿ ಸಂಖ್ಯೆ CC-2026-8942 ಪ್ರಯತ್ನಿಸಿ",
      "Looking for an update on your complaint?": "ನಿಮ್ಮ ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ತಿಳಿಯಲು ಬಯಸುವಿರಾ?",
      "Where can I find my reference number?": "ನನ್ನ ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಎಲ್ಲಿ ಸಿಗುತ್ತದೆ?",
      "Print Status": "ಪ್ರಿಂಟ್ ಮಾಡಿ",
      "Resolution Progress Timeline": "ಪರಿಹಾರ ಪ್ರಗತಿ ಕಾಲಾನುಕ್ರಮ",
      "Official Department Dispatch & Resolution Notes": "ಇಲಾಖೆಯ ಕ್ಷೇತ್ರ ಪರಿಶೀಲನೆ ಮತ್ತು ಅಧಿಕೃತ ಟಿಪ್ಪಣಿಗಳು",
      "Citizen's Description": "ನಾಗರಿಕರು ನೀಡಿದ ವಿವರಣೆ",
      "Citizen's Statement": "ನಾಗರಿಕರ ಹೇಳಿಕೆ",
      "Submitted On": "ಸಲ್ಲಿಸಿದ ದಿನಾಂಕ",
      "Location Summary": "ಸ್ಥಳದ ವಿವರ",
      "Assigned to:": "ನಿಯೋಜಿಸಲಾದ ಇಲಾಖೆ:",
      "Assigned Enforcement Authority:": "ಸಂಬಂಧಪಟ್ಟ ಜಾರಿ ಪ್ರಾಧಿಕಾರ:",
      "Applicable Statutory Act:": "ಅನ್ವಯವಾಗುವ ಕಾನೂನು ಕಾಯಿದೆ:",
      "📋 How This Grievance Is Monitored & Inspected On Ground:": "📋 ಈ ದೂರನ್ನು ಸ್ಥಳದಲ್ಲಿ ಹೇಗೆ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡಲಾಗುತ್ತದೆ ಮತ್ತು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ:",
      "Reference Number Not Found": "ಉಲ್ಲೇಖ ಸಂಖ್ಯೆ ಕಂಡುಬಂದಿಲ್ಲ",
      "File a New Complaint": "ಹೊಸ ದೂರನ್ನು ದಾಖಲಿಸಿ",

      // Status Badges
      "Pending Review": "ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ",
      "In Progress": "ಪ್ರಗತಿಯಲ್ಲಿದೆ",
      "Resolved": "ಪರಿಹರಿಸಲಾಗಿದೆ",
      "Received": "ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
      "Completed": "ಪೂರ್ಣಗೊಂಡಿದೆ",

      // Department Dashboard & Login
      "Department Operations Dashboard": "ಇಲಾಖಾ ಕಾರ್ಯಾಚರಣೆ ಫಲಕ",
      "Department Staff Dashboard": "ಇಲಾಖಾ ಸಿಬ್ಬಂದಿ ಫಲಕ",
      "Total Grievances": "ಒಟ್ಟು ದೂರುಗಳು",
      "Awaiting field triage": "ಕ್ಷೇತ್ರ ಪರಿಶೀಲನೆಗೆ ಕಾಯುತ್ತಿದೆ",
      "Crews dispatched on site": "ಸಿಬ್ಬಂದಿಯನ್ನು ನಿಯೋಜಿಸಲಾಗಿದೆ",
      "Fully inspected & closed": "ಸಂಪೂರ್ಣ ಪರಿಶೀಲಿಸಿ ಮುಕ್ತಾಯಗೊಳಿಸಲಾಗಿದೆ",
      "All submitted complaints": "ಸಲ್ಲಿಸಲಾದ ಎಲ್ಲಾ ದೂರುಗಳು",
      "Update Status & Dispatch Notes": "ಸ್ಥಿತಿ ಮತ್ತು ಕ್ಷೇತ್ರ ಟಿಪ್ಪಣಿಗಳನ್ನು ನವೀಕರಿಸಿ",
      "Change Complaint Status": "ದೂರಿನ ಸ್ಥಿತಿಯನ್ನು ಬದಲಾಯಿಸಿ",
      "Officer Update / Public Resolution Note": "ಅಧಿಕಾರಿಗಳ ಟಿಪ್ಪಣಿ / ಪರಿಹಾರದ ವಿವರ",
      "Save & Notify Citizen": "ಉಳಿಸಿ ಮತ್ತು ನಾಗರಿಕರಿಗೆ ತಿಳಿಸಿ",
      "All Categories": "ಎಲ್ಲಾ ವರ್ಗಗಳು",
      "Filter by Category": "ವರ್ಗದ ಪ್ರಕಾರ ಫಿಲ್ಟರ್ ಮಾಡಿ",
      "Municipal Officer Portal": "ನಗರ ಪಾಲಿಕೆ ಅಧಿಕಾರಿಗಳ ಪೋರ್ಟಲ್",
      "Restricted to authorized municipal inspectors, tree authority officers, and civic division engineers.": "ಅಧಿಕೃತ ನಗರ ಪಾಲಿಕೆ ನಿರೀಕ್ಷಕರು ಮತ್ತು ಎಂಜಿನಿಯರ್‌ಗಳಿಗೆ ಮಾತ್ರ ಸೀಮಿತವಾಗಿದೆ.",
      "Officer Email or Badge ID": "ಅಧಿಕಾರಿ ಇಮೇಲ್ ಅಥವಾ ಬ್ಯಾಡ್ಜ್ ಸಂಖ್ಯೆ",
      "Official Password": "ಅಧಿಕೃತ ಪಾಸ್‌ವರ್ಡ್",
      "Verify & Access Dashboard": "ಪರಿಶೀಲಿಸಿ ಮತ್ತು ಡ್ಯಾಶ್‌ಬೋರ್ಡ್ ತೆರೆಯಿರಿ",
      "⚡ Quick-Select Demo Officer (1-Click Test):": "⚡ ಡೆಮೊ ಅಧಿಕಾರಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ (1-ಕ್ಲಿಕ್ ಪರೀಕ್ಷೆ):",
      "Are you a resident?": "ನೀವು ನಾಗರಿಕರೇ?",
      "Track your complaint here": "ನಿಮ್ಮ ದೂರನ್ನು ಇಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
      "File a new grievance": "ಹೊಸ ದೂರನ್ನು ದಾಖಲಿಸಿ",
      "Quick Navigation": "ತ್ವರಿತ ನ್ಯಾವಿಗೇಷನ್"
    }
  };

  // Input Placeholders across languages (Matching Page 1 HTML)
  const PLACEHOLDERS = {
    hi: {
      "e.g. 5th Main Road, near Metro Pillar 142, Ward 12": "उदा. 5वां मेन रोड, मेट्रो पिलर 142 के पास, वार्ड 12",
      "Please explain the problem clearly. Mention when it started, how severe it is, and any specific landmarks to help the repair crew locate it.": "कृपया समस्या का स्पष्ट वर्णन करें। यह कब शुरू हुई, कितनी गंभीर है और मरम्मत टीम की सहायता हेतु कोई प्रमुख लैंडमार्क बताएं।",
      "e.g. Ramesh Kumar": "उदा. रमेश कुमार",
      "e.g. 98765 43210": "उदा. 98765 43210",
      "e.g. CC-2026-8942": "उदा. CC-2026-8942",
      "e.g. tree.officer@civicconnect.gov.in or TREE-OFF-101": "उदा. tree.officer@civicconnect.gov.in या TREE-OFF-101",
      "Enter your security credentials": "अपना सुरक्षा पासवर्ड दर्ज करें",
      "e.g. Suction tanker dispatched to chamber #15. Expected completion by 4 PM.": "उदा. निरीक्षण कक्ष #15 के लिए सक्शन टैंकर भेजा गया है। शाम 4 बजे तक कार्य पूर्ण होने का अनुमान।"
    },
    ta: {
      "e.g. 5th Main Road, near Metro Pillar 142, Ward 12": "எ.கா. 5வது மெயின் ரோடு, மெட்ரோ தூண் 142 அருகில், வார்டு 12",
      "Please explain the problem clearly. Mention when it started, how severe it is, and any specific landmarks to help the repair crew locate it.": "பிரச்சனையை தெளிவாக விளக்குங்கள். அது எப்போது தொடங்கியது, எவ்வளவு தீவிரமானது மற்றும் பழுதுபார்க்கும் குழுவிற்கு உதவ ஏதேனும் அடையாளங்களை குறிப்பிடவும்.",
      "e.g. Ramesh Kumar": "எ.கா. ரமேஷ் குமார்",
      "e.g. 98765 43210": "எ.கா. 98765 43210",
      "e.g. CC-2026-8942": "எ.கா. CC-2026-8942",
      "e.g. tree.officer@civicconnect.gov.in or TREE-OFF-101": "எ.கா. tree.officer@civicconnect.gov.in அல்லது TREE-OFF-101",
      "Enter your security credentials": "உங்கள் கடவுச்சொல்லை உள்ளிடவும்",
      "e.g. Suction tanker dispatched to chamber #15. Expected completion by 4 PM.": "எ.கா. சாக்கடை நீர் அகற்றும் வாகனம் அனுப்பப்பட்டுள்ளது. மாலை 4 மணிக்குள் பணி நிறைவடையும்."
    },
    kn: {
      "e.g. 5th Main Road, near Metro Pillar 142, Ward 12": "ಉದಾ. 5ನೇ ಮುಖ್ಯ ರಸ್ತೆ, ಮೆಟ್ರೋ ಪಿಲ್ಲರ್ 142 ಹತ್ತಿರ, ವಾರ್ಡ್ 12",
      "Please explain the problem clearly. Mention when it started, how severe it is, and any specific landmarks to help the repair crew locate it.": "ದಯವಿಟ್ಟು ಸಮಸ್ಯೆಯನ್ನು ಸ್ಪಷ್ಟವಾಗಿ ವಿವರಿಸಿ. ಇದು ಯಾವಾಗ ಪ್ರಾರಂಭವಾಯಿತು, ಎಷ್ಟು ಗಂಭೀರವಾಗಿದೆ ಮತ್ತು ರಿಪೇರಿ ಸಿಬ್ಬಂದಿಗೆ ಸಹಾಯವಾಗುವ ಹೆಗ್ಗುರುತುಗಳನ್ನು ತಿಳಿಸಿ.",
      "e.g. Ramesh Kumar": "ಉದಾ. ರಮೇಶ್ ಕುಮಾರ್",
      "e.g. 98765 43210": "ಉದಾ. 98765 43210",
      "e.g. CC-2026-8942": "ಉದಾ. CC-2026-8942",
      "e.g. tree.officer@civicconnect.gov.in or TREE-OFF-101": "ಉದಾ. tree.officer@civicconnect.gov.in ಅಥವಾ TREE-OFF-101",
      "Enter your security credentials": "ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ",
      "e.g. Suction tanker dispatched to chamber #15. Expected completion by 4 PM.": "ಉದಾ. ಸಕ್ಷನ್ ಟ್ಯಾಂಕರ್ ಕಳುಹಿಸಲಾಗಿದೆ. ಸಂಜೆ 4 ಗಂಟೆಗೆ ಕಾಮಗಾರಿ ಮುಕ್ತಾಯವಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ."
    }
  };

  /**
   * Helper to translate a given text string into current or specified language
   */
  function t(key, targetLang) {
    const lang = targetLang || localStorage.getItem('civic_lang') || 'en';
    if (lang === 'en') return key;
    const dict = DICTS[lang] || {};
    return dict[key] || key;
  }

  /**
   * Translates DOM elements by remembering their original English strings in data attributes.
   * This completely avoids multi-switch degradation bugs.
   */
  function translateDOM(targetLang) {
    const isEn = targetLang === 'en';
    const dict = DICTS[targetLang] || {};

    // 1. All text elements
    const selector = 'h1, h2, h3, h4, h5, h6, p, label, button, a, span, th, td, div.form-hint, div.metric-label, div.metric-trend, div.meta-item-label, div.privacy-note div, div.error-message, #proofDropZone div, #proofDropZone span, #useGpsBtn span';
    const elements = document.querySelectorAll(selector);

    elements.forEach((el) => {
      if (el.closest('svg') || el.closest('code') || el.closest('#langDropdownMenu')) return;

      Array.from(el.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const raw = node.nodeValue.trim();
          if (!raw) return;

          // Initialize original English text cache
          if (!node._civicOriginalEn) {
            // Check if raw is already an English key in our dictionaries
            let foundKey = raw;
            // If raw happens to be a translated value from previously saved session, resolve back to English key
            for (const lang of ['hi', 'ta', 'kn']) {
              for (const [k, v] of Object.entries(DICTS[lang] || {})) {
                if (v === raw) {
                  foundKey = k;
                  break;
                }
              }
            }
            node._civicOriginalEn = foundKey;
          }

          const originalEn = node._civicOriginalEn;

          if (isEn) {
            node.nodeValue = node.nodeValue.replace(raw, originalEn);
          } else {
            const translated = dict[originalEn];
            if (translated) {
              node.nodeValue = node.nodeValue.replace(raw, translated);
            }
          }
        }
      });
    });

    // Direct ID element translations for critical features to guarantee 100% translation
    const directElements = [
      { id: 'useGpsBtnText', key: 'Use My Current Location' },
      { id: 'proofUploadLabelText', key: 'Upload Images' },
      { id: 'proofDropMainText', key: 'Click to select or drag & drop images here' },
      { id: 'proofDropSubText', key: 'JPG, PNG, or WebP • Max 6 images • Each file ≤ 5 MB' },
      { id: 'proofHintText', key: 'Upload 1–6 photos as evidence of the civic issue (e.g. pothole, broken pipe, garbage dump).' },
      { id: 'proofErrorText', key: 'Please upload at least one proof image.' },
      { id: 'modalTitle', key: 'Inspect Evidence Photo' },
      { id: 'modalSub', key: 'Evaluating reported civic grievance severity' },
      { id: 'modalDismissBtn', key: 'Close Preview' }
    ];

    directElements.forEach(({ id, key }) => {
      const el = document.getElementById(id);
      if (el) {
        if (isEn) {
          el.textContent = key;
        } else if (dict[key]) {
          el.textContent = dict[key];
        }
      }
    });

    // 2. Select Option elements (Categories & Statuses)
    document.querySelectorAll('select option').forEach((opt) => {
      const currentText = opt.textContent.trim();
      if (!opt._civicOriginalEn) {
        let found = currentText;
        for (const lang of ['hi', 'ta', 'kn']) {
          for (const [k, v] of Object.entries(DICTS[lang] || {})) {
            if (v === currentText) {
              found = k;
              break;
            }
          }
        }
        opt._civicOriginalEn = found;
      }

      const origEn = opt._civicOriginalEn;
      if (isEn) {
        opt.textContent = origEn;
      } else if (dict[origEn]) {
        opt.textContent = dict[origEn];
      }
    });

    // 3. Form Input Placeholders
    const placeholderDict = PLACEHOLDERS[targetLang] || {};
    document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach((input) => {
      const curPh = (input.getAttribute('placeholder') || '').trim();
      if (!input._civicOriginalPh) {
        let orig = curPh;
        for (const lang of ['hi', 'ta', 'kn']) {
          for (const [k, v] of Object.entries(PLACEHOLDERS[lang] || {})) {
            if (v === curPh) {
              orig = k;
              break;
            }
          }
        }
        input._civicOriginalPh = orig;
      }

      const originalPh = input._civicOriginalPh;
      if (isEn) {
        input.setAttribute('placeholder', originalPh);
      } else if (placeholderDict[originalPh]) {
        input.setAttribute('placeholder', placeholderDict[originalPh]);
      }
    });

    // 4. Dynamic Text (Groq AI Roadmap & Descriptions)
    if (!isEn) {
      translateDynamicContent(targetLang);
    }
  }

  /**
   * Calls the Groq AI translation API for dynamic texts (e.g. AI Roadmap & citizen statements)
   */
  async function translateDynamicContent(targetLang) {
    const lang = targetLang || localStorage.getItem('civic_lang') || 'hi';
    if (lang === 'en') return;

    // Translate AI Key Issue if present
    const aiIssue = document.getElementById('aiKeyIssue');
    if (aiIssue && aiIssue.getAttribute('data-translated-lang') !== lang) {
      const text = aiIssue.textContent.trim();
      if (text) {
        callGroqTranslate(text, lang, (translated) => {
          aiIssue.textContent = translated;
          aiIssue.setAttribute('data-translated-lang', lang);
        });
      }
    }

    // Translate Roadmap Procedures
    const roadmapSteps = document.querySelectorAll('#aiRoadmapSteps p');
    roadmapSteps.forEach((p) => {
      if (p.getAttribute('data-translated-lang') !== lang) {
        const text = p.textContent.trim();
        callGroqTranslate(text, lang, (translated) => {
          p.textContent = translated;
          p.setAttribute('data-translated-lang', lang);
        });
      }
    });

    // Translate Department Notes if present
    const deptNotes = document.getElementById('resultDeptNotes');
    if (deptNotes && deptNotes.getAttribute('data-translated-lang') !== lang) {
      const text = deptNotes.textContent.trim();
      if (text && text.length > 5) {
        callGroqTranslate(text, lang, (translated) => {
          deptNotes.textContent = translated;
          deptNotes.setAttribute('data-translated-lang', lang);
        });
      }
    }
  }

  /**
   * Helper to invoke /api/translate
   */
  async function callGroqTranslate(text, targetLang, callback) {
    try {
      const resp = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text, target: targetLang })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.success && data.translated) {
          callback(data.translated);
        }
      }
    } catch (e) {
      console.warn("Groq dynamic translation skipped:", e);
    }
  }

  /**
   * Sets active language and updates UI dropdown and document attributes.
   */
  function setLanguage(lang) {
    localStorage.setItem('civic_lang', lang);
    document.documentElement.lang = lang;

    const display = document.getElementById('currentLangDisplay');
    if (display) {
      display.textContent = LANG_NAMES[lang] || 'English';
    }

    // Toggle checkmarks
    ['en', 'hi', 'ta', 'kn'].forEach((code) => {
      const checkElem = document.getElementById(`check-${code}`);
      if (checkElem) {
        checkElem.style.display = code === lang ? 'inline' : 'none';
      }
    });

    translateDOM(lang);
  }

  /**
   * Initializes language switcher event listeners and loads saved language.
   */
  function init() {
    const selectorBtn = document.getElementById('langSelectorBtn');
    const menu = document.getElementById('langDropdownMenu');

    if (selectorBtn && menu) {
      selectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.style.display === 'block';
        menu.style.display = isOpen ? 'none' : 'block';
        selectorBtn.setAttribute('aria-expanded', !isOpen);
      });

      document.addEventListener('click', () => {
        menu.style.display = 'none';
        selectorBtn.setAttribute('aria-expanded', 'false');
      });

      document.querySelectorAll('.lang-choice-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const chosenLang = btn.getAttribute('data-lang');
          setLanguage(chosenLang);
          menu.style.display = 'none';
          selectorBtn.setAttribute('aria-expanded', 'false');
        });
      });
    }

    // Default to English, or load user's previously saved preference
    const savedLang = localStorage.getItem('civic_lang') || 'en';
    setLanguage(savedLang);
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.CivicTranslate = {
    setLanguage: setLanguage,
    translateDOM: translateDOM,
    translateDynamicContent: translateDynamicContent,
    t: t,
    getCurrentLang: function () {
      return localStorage.getItem('civic_lang') || 'en';
    },
    LANG_NAMES: LANG_NAMES
  };
})();
