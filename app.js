/* Seite in der gewählten Sprache anzeigen, E-Mail vorbereiten, Vorlesen.
   Die Texte selbst stehen in texte.js. */
(function () {
  "use strict";
  var CFG = window.EINSTELLUNGEN;
  var T = window.TEXTE;
  var ORDER = window.SPRACHEN;
  var current = null;

  function $(id) { return document.getElementById(id); }

  /* ---------- Sprachbuttons ---------- */
  var list = $("langList");
  ORDER.forEach(function (code) {
    var a = document.createElement("a");
    a.className = "langbtn";
    a.href = "#" + code;
    a.lang = code;
    a.textContent = T[code].langName;
    a.addEventListener("click", function (e) {
      e.preventDefault();
      history.replaceState(null, "", "#" + code);
      setLang(code);
    });
    list.appendChild(a);
  });

  function fillList(id, items, asSteps) {
    var el = $(id);
    el.innerHTML = "";
    items.forEach(function (it) {
      var li = document.createElement("li");
      if (asSteps) {
        var h = document.createElement("h3"); h.textContent = it[0]; h.setAttribute("data-read", "");
        var p = document.createElement("p"); p.textContent = it[1]; p.setAttribute("data-read", "");
        li.appendChild(h); li.appendChild(p);
      } else {
        li.textContent = it;
        li.setAttribute("data-read", "");
      }
      el.appendChild(li);
    });
  }

  /* ---------- E-Mail-Vorlagen ---------- */
  function mailto(subject, body) {
    return "mailto:" + CFG.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function label(t, de, key) {
    return t === de ? de[key] : t[key] + " / " + de[key];
  }
  function parentMail(code) {
    var t = T[code], de = T.de;
    var lines = [t.mail.greeting, "", t.mail.request];
    if (code !== "de") lines.push("(" + de.mail.request + ")");
    lines.push("",
      label(t.mail, de.mail, "name") + ": ",
      label(t.mail, de.mail, "child") + ": ",
      label(t.mail, de.mail, "school") + ": ",
      label(t.mail, de.mail, "phone") + ": ",
      label(t.mail, de.mail, "language") + ": " + t.langName + (code !== "de" ? " (" + t.deName + ")" : ""),
      "", t.mail.thanks);
    var subj = de.mail.subject + (code !== "de" ? " – " + t.deName + " / " + t.mail.subject : "");
    return mailto(subj, lines.join("\n"));
  }
  function patenMail(code) {
    var t = T[code], de = T.de;
    var lines = [t.mail.greeting, "", t.patenMail.request];
    if (code !== "de") lines.push("(" + de.patenMail.request + ")");
    lines.push("",
      label(t.mail, de.mail, "name") + ": ",
      label(t.mail, de.mail, "phone") + ": ",
      label(t.patenMail, de.patenMail, "languages") + ": ",
      label(t.patenMail, de.patenMail, "time") + ": ",
      "", t.mail.thanks);
    var subj = de.patenMail.subject + (code !== "de" ? " / " + t.patenMail.subject : "");
    return mailto(subj, lines.join("\n"));
  }

  /* ---------- Sprache setzen ---------- */
  function setLang(code) {
    if (!T[code]) code = "de";
    stopReading();
    current = code;
    var t = T[code];
    document.documentElement.lang = code;
    document.documentElement.dir = t.dir || "ltr";
    document.title = t.pageTitle;

    document.querySelectorAll("[data-t]").forEach(function (el) {
      var k = el.getAttribute("data-t");
      var v = (k in t) ? t[k] : T.de[k];
      if (typeof v === "string") el.textContent = v;
    });
    fillList("chips", t.chips);
    fillList("steps", t.steps, true);
    fillList("helpItems", t.helpItems);
    fillList("photoSteps", t.photoSteps);
    fillList("patenItems", t.patenItems);

    $("mailBtn").href = parentMail(code);
    $("patenBtn").href = patenMail(code);
    $("mailAddr").textContent = CFG.email;

    ["lnkImpressum", "lnkDatenschutz"].forEach(function (id) {
      var a = $(id);
      a.lang = "de";
      a.setAttribute("hreflang", "de");
    });

    list.querySelectorAll(".langbtn").forEach(function (b) {
      b.setAttribute("aria-current", b.lang === code ? "true" : "false");
    });
    $("readMsg").hidden = true;
  }

  /* ---------- Adresse kopieren ---------- */
  $("copyBtn").addEventListener("click", function () {
    var btn = this;
    function done() {
      btn.textContent = T[current].copied;
      setTimeout(function () { btn.textContent = T[current].copyBtn; }, 2000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(CFG.email).then(done, function () {});
    } else {
      var r = document.createRange(); r.selectNodeContents($("mailAddr"));
      var s = getSelection(); s.removeAllRanges(); s.addRange(r);
      try { document.execCommand("copy"); done(); } catch (e) {}
    }
  });

  /* ---------- Vorlesen ----------
     1. Gibt es eine Aufnahme audio/<sprache>.mp3? Dann wird sie abgespielt.
     2. Sonst liest die Stimme des Geräts vor (falls für die Sprache vorhanden). */
  var readBtn = $("readBtn");
  var audio = null;
  var reading = false;
  var synth = window.speechSynthesis;

  function setReading(on) {
    reading = on;
    readBtn.setAttribute("aria-pressed", on ? "true" : "false");
    $("readLabel").textContent = on ? T[current].readStop : T[current].readBtn;
    if (!on) document.querySelectorAll(".reading").forEach(function (e) { e.classList.remove("reading"); });
  }
  function stopReading() {
    if (audio) { audio.pause(); audio = null; }
    if (synth) synth.cancel();
    if (current) setReading(false);
  }
  function showMsg(text) { var m = $("readMsg"); m.textContent = text; m.hidden = false; }

  function getVoice(t) {
    if (!synth) return null;
    var voices = synth.getVoices();
    var wanted = t.ttsLangs;
    for (var i = 0; i < wanted.length; i++) {
      var w = wanted[i].toLowerCase();
      for (var j = 0; j < voices.length; j++) {
        var vl = voices[j].lang.toLowerCase().replace("_", "-");
        if (vl === w || vl.indexOf(w + "-") === 0 || (w.indexOf("-") < 0 && vl.split("-")[0] === w)) return voices[j];
      }
    }
    return null;
  }
  function voicesReady(cb) {
    if (!synth) return cb();
    if (synth.getVoices().length) return cb();
    var called = false;
    function go() { if (!called) { called = true; cb(); } }
    synth.addEventListener && synth.addEventListener("voiceschanged", go);
    setTimeout(go, 1200);
  }

  function speakPage(t) {
    voicesReady(function () {
      var voice = getVoice(t);
      if (!voice) { setReading(false); showMsg(t.noVoice); return; }
      var parts = [];
      document.querySelectorAll("main [data-read]").forEach(function (el) {
        var txt = el.textContent.trim();
        if (!txt) return;
        // in Sätze teilen – lange Texte brechen auf manchen Handys sonst ab
        txt.split(/(?<=[.!?؟:])\s+/).forEach(function (s) { if (s.trim()) parts.push({ el: el, text: s }); });
      });
      synth.cancel();
      parts.forEach(function (p, i) {
        var u = new SpeechSynthesisUtterance(p.text);
        u.voice = voice; u.lang = voice.lang; u.rate = 0.92;
        u.onstart = function () {
          document.querySelectorAll(".reading").forEach(function (e) { if (e !== p.el) e.classList.remove("reading"); });
          p.el.classList.add("reading");
          if (i === 0 || parts[i - 1].el !== p.el) p.el.scrollIntoView({ block: "center", behavior: "smooth" });
        };
        if (i === parts.length - 1) u.onend = function () { setReading(false); };
        synth.speak(u);
      });
    });
  }

  readBtn.addEventListener("click", function () {
    if (reading) { stopReading(); return; }
    var t = T[current];
    $("readMsg").hidden = true;
    setReading(true);
    audio = new Audio("audio/" + current + ".mp3");
    audio.onended = function () { setReading(false); audio = null; };
    audio.play().catch(function () {
      audio = null;
      if (!reading) return;
      if (!synth) { setReading(false); showMsg(t.noVoice); return; }
      speakPage(t);
    });
  });

  /* ---------- Start ---------- */
  function fromHash() {
    var h = decodeURIComponent(location.hash.replace("#", ""));
    return T[h] ? h : "de";
  }
  window.addEventListener("hashchange", function () {
    var h = location.hash.replace("#", "");
    if (T[h] && h !== current) setLang(h);
  });
  // Sprunglinks innerhalb der Seite (z. B. zum Kontakt) ändern die Sprache nicht
  document.querySelectorAll('a[href^="#"]:not(.langbtn)').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.getElementById(a.getAttribute("href").slice(1));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  });
  setLang(fromHash());
})();
