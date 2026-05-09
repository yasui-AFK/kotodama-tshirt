// pdf-engine.js
// 既存 app.js から移植した PDF 生成エンジン。
// window.KT_PDF.* として公開。jsPDF + 既存の Canvas ベース日本語レンダリング方式を維持。
//
// 依存（読み込み順序）:
//   1. data/legacy-data.js          (window.kotodamaData, window.ENGLISH_MEANINGS, window.ROMAJI_MAP)
//   2. data/name-dictionary.js      (window.lookupNameDictionary)
//   3. data/kotodama-deep-meanings.js (window.DEEP_MEANINGS)
//   4. kotodama-data.js             (window.KOTODAMA, window.readName)
//   5. data-bridge.js               (window.convertName, window.lookupKotodama, window.generateStory, window.trackEvent)
//   6. https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js
//   7. このファイル

(function () {
  // === 短い英訳（share card / Free Sample 用）===
  function getEnglishMeaning(kana) {
    return (window.ENGLISH_MEANINGS && window.ENGLISH_MEANINGS[kana])
      || 'Mystery — a spirit yet to be named';
  }

  function getDeepMeaning(kana) {
    if (window.DEEP_MEANINGS && window.DEEP_MEANINGS[kana]) return window.DEEP_MEANINGS[kana];
    return getEnglishMeaning(kana);
  }

  // === Asset preload ===
  let bgWashiImg = null;
  function loadBgImage() {
    return new Promise((resolve) => {
      if (bgWashiImg) { resolve(bgWashiImg); return; }
      const img = new Image();
      img.onload = () => { bgWashiImg = img; resolve(img); };
      img.onerror = () => resolve(null);
      img.src = 'bg-washi.png';
    });
  }

  async function preloadFonts() {
    const fonts = [
      '900 72px "Inter"',
      '700 48px "Noto Serif JP"',
      '600 24px "Noto Serif JP"',
      '400 20px "Inter"',
    ];
    try {
      await Promise.all(fonts.map(f => document.fonts.load(f)));
    } catch (_) { /* ignore */ }
  }

  // === Canvas helpers ===
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, currentY);
        line = words[i] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, currentY);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function renderHiraganaToImage(text, canvasW, canvasH, fontSize, color = '#3a3024') {
    const c = document.createElement('canvas');
    c.width = canvasW;
    c.height = canvasH;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgba(255,255,255,0)';
    ctx.fillRect(0, 0, canvasW, canvasH);
    ctx.font = `500 ${fontSize}px "Noto Serif JP"`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvasW / 2, canvasH / 2);
    return c.toDataURL('image/png');
  }

  // === Bold Washi share card ===
  async function renderShareCard(name, hiragana, kotodamaResults, canvasId = 'shareCardCanvas', scale = 1) {
    const [, bgImg] = await Promise.all([preloadFonts(), loadBgImage()]);

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1080;
    const H = 1080;

    canvas.width = W * scale;
    canvas.height = H * scale;
    if (scale !== 1) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(scale, scale);
    }

    const filtered = kotodamaResults.filter(k => !k.isSpecial);
    const cleanHiragana = filtered.map(k => k.kana).join('');

    // === Background ===
    if (bgImg) {
      const imgW = bgImg.naturalWidth;
      const imgH = bgImg.naturalHeight;
      const fitScale = Math.max(W / imgW, H / imgH);
      const sw = W / fitScale;
      const sh = H / fitScale;
      const sx = (imgW - sw) / 2;
      const sy = (imgH - sh) / 2;
      ctx.drawImage(bgImg, sx, sy, sw, sh, 0, 0, W, H);
    } else {
      ctx.fillStyle = '#f0ead6';
      ctx.fillRect(0, 0, W, H);
    }

    ctx.font = '600 24px "Inter"';
    ctx.fillStyle = '#c53d43';
    ctx.textAlign = 'center';
    ctx.fillText('K O T O D A M A', W / 2, 65);

    ctx.font = '300 20px "Inter"';
    ctx.fillStyle = '#7a6e58';
    ctx.fillText('The spirit of your name', W / 2, 100);

    ctx.strokeStyle = 'rgba(197,61,67,0.15)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 160, 118);
    ctx.lineTo(W / 2 + 160, 118);
    ctx.stroke();

    const nameText = name.toUpperCase();
    let nameFontSize = 140;
    if (nameText.length > 8) nameFontSize = 105;
    if (nameText.length > 12) nameFontSize = 80;
    ctx.font = `900 ${nameFontSize}px "Inter"`;
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(nameText, W / 2, 280);

    let kanaFontSize = 72;
    if (cleanHiragana.length > 6) kanaFontSize = 58;
    if (cleanHiragana.length > 10) kanaFontSize = 44;
    ctx.font = `400 ${kanaFontSize}px "Noto Serif JP"`;
    ctx.fillStyle = '#3a3024';
    ctx.fillText(cleanHiragana, W / 2, 365);

    ctx.strokeStyle = '#c53d43';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 40, 395);
    ctx.lineTo(W / 2 + 40, 395);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(W / 2, 395, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#c53d43';
    ctx.fill();

    const pillStartY = 440;
    const pillHeight = 58;
    const pillGap = 12;
    const pillMaxWidth = 840;
    const maxPills = Math.min(filtered.length, 6);

    for (let i = 0; i < maxPills; i++) {
      const k = filtered[i];
      const y = pillStartY + i * (pillHeight + pillGap);
      const meaning = getEnglishMeaning(k.kana);
      const pillW = pillMaxWidth;
      const pillX = (W - pillW) / 2;
      const radius = 8;

      ctx.fillStyle = 'rgba(225,218,195,0.5)';
      roundRect(ctx, pillX, y, pillW, pillHeight, radius);
      ctx.fill();

      ctx.fillStyle = k.color;
      roundRect(ctx, pillX, y, 5, pillHeight, 2);
      ctx.fill();

      ctx.font = '600 30px "Noto Serif JP"';
      ctx.fillStyle = '#1a1a1a';
      ctx.textAlign = 'left';
      ctx.fillText(k.kana, pillX + 24, y + pillHeight / 2 + 10);

      ctx.font = '500 22px "Inter"';
      ctx.fillStyle = '#3a3024';
      ctx.fillText(meaning, pillX + 80, y + pillHeight / 2 + 8);
    }

    const storyY = pillStartY + maxPills * (pillHeight + pillGap) + 30;
    const story = (window.generateStory || (() => ''))(name, kotodamaResults);
    if (story) {
      ctx.font = 'italic 400 24px "Inter"';
      ctx.fillStyle = '#4a3f30';
      ctx.textAlign = 'center';
      wrapText(ctx, story, W / 2, storyY, W - 180, 34);
    }

    // Hanko
    const hankoX = W - 90;
    const hankoY = H - 90;
    const hankoSize = 56;

    ctx.save();
    ctx.translate(hankoX, hankoY);
    ctx.rotate(-5 * Math.PI / 180);
    ctx.strokeStyle = '#c53d43';
    ctx.lineWidth = 2.5;
    roundRect(ctx, -hankoSize / 2, -hankoSize / 2, hankoSize, hankoSize, 5);
    ctx.stroke();
    ctx.font = '700 20px "Noto Serif JP"';
    ctx.fillStyle = '#c53d43';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('言霊', 0, 0);
    ctx.restore();

    ctx.font = '300 17px "Inter"';
    ctx.fillStyle = '#7a6e58';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText('Discover yours at kotodama.app', W / 2, H - 40);
  }

  // === PDF helpers ===
  function drawPdfHeader(pdf, subtitle) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(197, 61, 67);
    pdf.text('K  O  T  O  D  A  M  A', 105, 18, { align: 'center' });
    if (subtitle) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9);
      pdf.setTextColor(122, 110, 88);
      pdf.text(subtitle, 105, 24, { align: 'center' });
    }
    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.3);
    pdf.line(85, 30, 125, 30);
  }

  function drawPdfFooter(pdf, customNote) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(150, 140, 120);
    if (customNote) {
      pdf.text(customNote, 105, 282, { align: 'center' });
    }
    pdf.text('kotodama.app  ·  The spirit of your name', 105, 290, { align: 'center' });
  }

  function drawSoundsSection(pdf, filtered, opts = {}) {
    const subtitle = opts.subtitle || 'The Spirit of Each Sound';
    const startY = 38;
    const pageMaxY = 268;
    const colKana = 22;
    const colText = 40;
    const textWidth = 150;

    drawPdfHeader(pdf, subtitle);
    let y = startY;
    let firstOnPage = true;

    for (let idx = 0; idx < filtered.length; idx++) {
      const k = filtered[idx];
      const deep = getDeepMeaning(k.kana);
      const wrapped = pdf.splitTextToSize(deep, textWidth);
      const blockHeight = 4 + wrapped.length * 4.5 + 6;

      if (!firstOnPage && y + blockHeight > pageMaxY) {
        drawPdfFooter(pdf);
        pdf.addPage();
        drawPdfHeader(pdf, `${subtitle} (continued)`);
        y = startY;
        firstOnPage = true;
      }
      firstOnPage = false;

      const kanaImg = renderHiraganaToImage(k.kana, 200, 200, 110, '#1a1a1a');
      pdf.addImage(kanaImg, 'PNG', colKana - 7, y - 6, 14, 14);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(58, 48, 36);
      pdf.text(getEnglishMeaning(k.kana), colText, y);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(80, 70, 55);
      pdf.text(wrapped, colText, y + 5);

      y += 4 + wrapped.length * 4.5 + 7;
    }
    drawPdfFooter(pdf);
  }

  // === Build a name reading (legacy buildNameReading equivalent) ===
  function buildNameReading(name) {
    if (!name || !name.trim()) return null;
    const trimmed = name.trim();
    const conv = window.convertName(trimmed);
    const hiragana = conv.hiragana;
    const kotodamaResults = window.lookupKotodama(hiragana);
    return { name: trimmed, hiragana, kotodamaResults };
  }

  // === Free Sample PDF ===
  async function generateFreeSamplePdf(name) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      alert('PDF library not loaded. Please refresh the page.');
      return;
    }
    await preloadFonts();

    const reading = buildNameReading(name);
    if (!reading || !reading.kotodamaResults) {
      alert('Could not generate a sample for that name. Please try a different spelling.');
      return;
    }

    const filtered = reading.kotodamaResults.filter(k => !k.isSpecial);
    if (filtered.length === 0) {
      alert('Could not generate a sample for that name. Please try a different spelling.');
      return;
    }
    const sampleCount = Math.min(3, filtered.length);
    const sampleChars = filtered.slice(0, sampleCount);
    const totalChars = filtered.length;
    const hasMore = totalChars > sampleCount;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(197, 61, 67);
    pdf.text('K  O  T  O  D  A  M  A', 105, 18, { align: 'center' });

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9);
    pdf.setTextColor(122, 110, 88);
    pdf.text('Free Sample Reading', 105, 24, { align: 'center' });

    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.3);
    pdf.line(85, 30, 125, 30);

    pdf.setFont('helvetica', 'bold');
    const nameUpper = name.toUpperCase();
    let nameFontSize = 36;
    if (nameUpper.length > 10) nameFontSize = 28;
    if (nameUpper.length > 14) nameFontSize = 22;
    pdf.setFontSize(nameFontSize);
    pdf.setTextColor(26, 26, 26);
    pdf.text(nameUpper, 105, 55, { align: 'center' });

    const sampleHiragana = sampleChars.map(k => k.kana).join('') + (hasMore ? ' …' : '');
    const hImg = renderHiraganaToImage(sampleHiragana, 1200, 200, 110);
    pdf.addImage(hImg, 'PNG', 50, 65, 110, 18);

    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.4);
    pdf.line(95, 95, 115, 95);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(122, 110, 88);
    pdf.text('FIRST THREE SOUNDS', 105, 105, { align: 'center' });

    let yPos = 118;
    for (let i = 0; i < sampleChars.length; i++) {
      const k = sampleChars[i];
      const kImg = renderHiraganaToImage(k.kana, 200, 100, 60, '#1a1a1a');
      pdf.addImage(kImg, 'PNG', 55, yPos - 7, 14, 8);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      pdf.setTextColor(58, 48, 36);
      pdf.text(getEnglishMeaning(k.kana), 78, yPos);
      yPos += 12;
    }

    const ctaY = 175;
    pdf.setFillColor(245, 235, 215);
    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.5);
    pdf.roundedRect(30, ctaY, 150, 60, 3, 3, 'FD');

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(122, 110, 88);
    if (hasMore) {
      pdf.text(`This is a free preview — your name has ${totalChars} sacred sounds in total.`, 105, ctaY + 11, { align: 'center' });
    } else {
      pdf.text('This is a free preview of your kotodama reading.', 105, ctaY + 11, { align: 'center' });
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(15);
    pdf.setTextColor(197, 61, 67);
    pdf.text('Unlock the full reading — $19', 105, ctaY + 27, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(122, 110, 88);
    pdf.text('All sounds · deep meanings · personal story · printable poster', 105, ctaY + 38, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(139, 105, 20);
    pdf.text('Visit kotodama.app', 105, ctaY + 50, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(150, 140, 120);
    pdf.text('kotodama.app  ·  The spirit of your name', 105, 285, { align: 'center' });

    pdf.save(`kotodama-${name.toLowerCase().replace(/\s+/g, '-')}-sample.pdf`);

    if (window.trackEvent) {
      window.trackEvent('free_sample_pdf_download', { name_input: name, total_chars: totalChars });
    }
  }

  // === $19 Personal Reading PDF ===
  async function generateFullPersonalPdf(name) {
    if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF library not loaded.'); return; }
    await preloadFonts();

    const reading = buildNameReading(name);
    if (!reading || !reading.kotodamaResults) { alert('Could not build a reading.'); return; }
    const filtered = reading.kotodamaResults.filter(k => !k.isSpecial);
    if (filtered.length === 0) { alert('No readable sounds in that name.'); return; }

    await renderShareCard(reading.name, reading.hiragana, reading.kotodamaResults, 'posterCanvas', 2);
    const posterImg = document.getElementById('posterCanvas').toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    drawPdfHeader(pdf, 'Personal Reading');

    pdf.setFont('helvetica', 'bold');
    let nameFontSize = 38;
    if (name.length > 10) nameFontSize = 30;
    if (name.length > 14) nameFontSize = 23;
    pdf.setFontSize(nameFontSize);
    pdf.setTextColor(26, 26, 26);
    pdf.text(name.toUpperCase(), 105, 60, { align: 'center' });

    const cleanHiragana = filtered.map(k => k.kana).join('');
    const hiraImg = renderHiraganaToImage(cleanHiragana, 1600, 220, 100);
    pdf.addImage(hiraImg, 'PNG', 35, 72, 140, 19);

    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.5);
    pdf.line(90, 102, 120, 102);

    const story = (window.generateStory || (() => ''))(reading.name, reading.kotodamaResults);
    if (story) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11.5);
      pdf.setTextColor(74, 63, 48);
      const wrapped = pdf.splitTextToSize(story, 160);
      pdf.text(wrapped, 105, 118, { align: 'center' });
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(122, 110, 88);
    const intro = pdf.splitTextToSize(
      'On the pages that follow, you will find each sound of your name, with its hidden meaning unfolded — as the old Japanese tradition of kotodama would have it heard.',
      160
    );
    pdf.text(intro, 105, 220, { align: 'center' });

    drawPdfFooter(pdf, `A reading prepared for ${name}.`);

    pdf.addPage();
    drawSoundsSection(pdf, filtered);

    pdf.addPage();
    drawPdfHeader(pdf, 'Your Kotodama, to print and frame');
    pdf.addImage(posterImg, 'PNG', 22, 38, 166, 166);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(122, 110, 88);
    pdf.text('A keepsake to print and frame.', 105, 215, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Recommended: A4 paper at 100% scale, or an 8×8 inch square frame.', 105, 222, { align: 'center' });
    drawPdfFooter(pdf);

    pdf.save(`kotodama-${name.toLowerCase().replace(/\s+/g, '-')}-personal-reading.pdf`);
    if (window.trackEvent) window.trackEvent('admin_personal_pdf_generated', { name });
  }

  // === $49 Gift Edition PDF ===
  async function generateGiftEditionPdf(recipientName, senderName, note) {
    if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF library not loaded.'); return; }
    await preloadFonts();

    const reading = buildNameReading(recipientName);
    if (!reading || !reading.kotodamaResults) { alert('Could not build a reading.'); return; }
    const filtered = reading.kotodamaResults.filter(k => !k.isSpecial);
    if (filtered.length === 0) { alert('No readable sounds in that name.'); return; }

    await renderShareCard(reading.name, reading.hiragana, reading.kotodamaResults, 'posterCanvas', 2);
    const posterImg = document.getElementById('posterCanvas').toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    // Page 1: Dedication
    drawPdfHeader(pdf, 'Gift Edition');
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(13);
    pdf.setTextColor(122, 110, 88);
    pdf.text('For', 105, 78, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    let recipFontSize = 30;
    if (recipientName.length > 10) recipFontSize = 24;
    if (recipientName.length > 14) recipFontSize = 19;
    pdf.setFontSize(recipFontSize);
    pdf.setTextColor(197, 61, 67);
    pdf.text(recipientName, 105, 98, { align: 'center' });

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(13);
    pdf.setTextColor(122, 110, 88);
    pdf.text('with love from', 105, 118, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    let sendFontSize = 22;
    if (senderName.length > 10) sendFontSize = 18;
    if (senderName.length > 14) sendFontSize = 15;
    pdf.setFontSize(sendFontSize);
    pdf.setTextColor(26, 26, 26);
    pdf.text(senderName, 105, 135, { align: 'center' });

    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.4);
    pdf.line(85, 150, 125, 150);

    if (note && note.length > 0) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(74, 63, 48);
      const wrapped = pdf.splitTextToSize(note, 140);
      pdf.text(wrapped, 105, 168, { align: 'center' });
    }

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(9.5);
    pdf.setTextColor(122, 110, 88);
    pdf.text('A kotodama reading, hand-prepared for someone you love.', 105, 230, { align: 'center' });
    drawPdfFooter(pdf);

    // Page 2: Cover
    pdf.addPage();
    drawPdfHeader(pdf, 'Personal Reading');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(recipFontSize);
    pdf.setTextColor(26, 26, 26);
    pdf.text(recipientName.toUpperCase(), 105, 60, { align: 'center' });

    const cleanHiragana = filtered.map(k => k.kana).join('');
    const hiraImg = renderHiraganaToImage(cleanHiragana, 1600, 220, 100);
    pdf.addImage(hiraImg, 'PNG', 35, 72, 140, 19);

    pdf.setDrawColor(197, 61, 67);
    pdf.setLineWidth(0.5);
    pdf.line(90, 102, 120, 102);

    const story = (window.generateStory || (() => ''))(reading.name, reading.kotodamaResults);
    if (story) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(11.5);
      pdf.setTextColor(74, 63, 48);
      const wrapped = pdf.splitTextToSize(story, 160);
      pdf.text(wrapped, 105, 118, { align: 'center' });
    }

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9.5);
    pdf.setTextColor(122, 110, 88);
    const intro = pdf.splitTextToSize(
      'On the pages that follow, you will find each sound of your name, with its hidden meaning unfolded — as the old Japanese tradition of kotodama would have it heard.',
      160
    );
    pdf.text(intro, 105, 220, { align: 'center' });

    drawPdfFooter(pdf, `A reading prepared for ${recipientName}.`);

    // Page 3+: Deep Meanings
    pdf.addPage();
    drawSoundsSection(pdf, filtered);

    // Final: Poster
    pdf.addPage();
    drawPdfHeader(pdf, 'Your Kotodama, to print and frame');
    pdf.addImage(posterImg, 'PNG', 22, 38, 166, 166);
    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(122, 110, 88);
    pdf.text('A keepsake to print and frame.', 105, 215, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text('Recommended: A4 paper at 100% scale, or an 8×8 inch square frame.', 105, 222, { align: 'center' });
    drawPdfFooter(pdf);

    pdf.save(`kotodama-${recipientName.toLowerCase().replace(/\s+/g, '-')}-gift-edition.pdf`);
    if (window.trackEvent) {
      window.trackEvent('admin_gift_pdf_generated', { recipient: recipientName, sender: senderName });
    }
  }

  // === $35 Couple Reading PDF ===
  function generateCoupleResonance(reading1, reading2) {
    const k1 = reading1.kotodamaResults.filter(k => !k.isSpecial);
    const k2 = reading2.kotodamaResults.filter(k => !k.isSpecial);
    const themes1 = k1.slice(0, 3).map(k => getEnglishMeaning(k.kana).split('—')[0].trim().toLowerCase());
    const themes2 = k2.slice(0, 3).map(k => getEnglishMeaning(k.kana).split('—')[0].trim().toLowerCase());
    return [
      `${reading1.name} & ${reading2.name} — your kotodama meet in resonance.`,
      `${reading1.name} carries the spirits of ${themes1.join(', ')}.`,
      `${reading2.name} carries the spirits of ${themes2.join(', ')}.`,
      `Together, your sounds weave a harmony that only you two share — a sacred dance of the hidden meanings within your names.`,
    ];
  }

  async function generateCoupleReadingPdf(name1, name2) {
    if (!window.jspdf || !window.jspdf.jsPDF) { alert('PDF library not loaded.'); return; }
    const reading1 = buildNameReading(name1);
    const reading2 = buildNameReading(name2);
    if (!reading1 || !reading2) { alert('Please enter both names.'); return; }

    await renderShareCard(reading1.name, reading1.hiragana, reading1.kotodamaResults, 'coupleCardCanvas1');
    await renderShareCard(reading2.name, reading2.hiragana, reading2.kotodamaResults, 'coupleCardCanvas2');

    const img1 = document.getElementById('coupleCardCanvas1').toDataURL('image/png');
    const img2 = document.getElementById('coupleCardCanvas2').toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(197, 61, 67);
    pdf.text('K  O  T  O  D  A  M  A', 105, 18, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(122, 110, 88);
    pdf.text('Couple Reading', 105, 24, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(60, 50, 40);
    pdf.text(`${reading1.name}  &  ${reading2.name}`, 105, 38, { align: 'center' });

    const cardSize = 85;
    const gap = 8;
    const totalWidth = cardSize * 2 + gap;
    const startX = (210 - totalWidth) / 2;
    const cardY = 50;
    pdf.addImage(img1, 'PNG', startX, cardY, cardSize, cardSize);
    pdf.addImage(img2, 'PNG', startX + cardSize + gap, cardY, cardSize, cardSize);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(122, 110, 88);
    pdf.text(reading1.name, startX + cardSize / 2, cardY + cardSize + 7, { align: 'center' });
    pdf.text(reading2.name, startX + cardSize + gap + cardSize / 2, cardY + cardSize + 7, { align: 'center' });

    const resonanceLines = generateCoupleResonance(reading1, reading2);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(197, 61, 67);
    pdf.text('THE RESONANCE BETWEEN YOU', 105, 160, { align: 'center' });

    pdf.setFont('helvetica', 'italic');
    pdf.setFontSize(10);
    pdf.setTextColor(80, 70, 60);
    let y = 172;
    resonanceLines.forEach((line) => {
      const wrapped = pdf.splitTextToSize(line, 170);
      wrapped.forEach(w => {
        pdf.text(w, 105, y, { align: 'center' });
        y += 6;
      });
      y += 2;
    });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(150, 140, 120);
    pdf.text('kotodama.app  ·  The spirit of your names', 105, 285, { align: 'center' });

    const slug = `${reading1.name}-${reading2.name}`.toLowerCase().replace(/\s+/g, '-');
    pdf.save(`kotodama-couple-${slug}-reading.pdf`);

    if (window.trackEvent) {
      window.trackEvent('couple_pdf_preview_download', { name1: reading1.name, name2: reading2.name });
    }
  }

  // === Public surface ===
  window.KT_PDF = {
    renderShareCard,
    generateFreeSamplePdf,
    generateFullPersonalPdf,
    generateGiftEditionPdf,
    generateCoupleReadingPdf,
    buildNameReading,
    preloadFonts,
  };
})();
