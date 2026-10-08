import { ic } from './_helpers.js';
export default [
  { id: 'patient', name: 'Patient Card', category: 'Sector · Health', sector: 'health', description: 'Patient identity with record id, tags and blood type.',
    classes: { base: 'patient', parts: ['patient-name', 'patient-id', 'patient-meta', 'blood-type'] },
    examples: [{ title: 'Patient', html: `<article class="patient"><span class="avatar avatar-lg avatar-info">AY</span><div><p class="patient-name">Ayşe Yılmaz</p><p class="patient-id">#PAT-2026-0847 · 42 · F</p><div class="patient-meta"><span class="badge">Cardiology</span><span class="badge badge-warning">Allergy: penicillin</span></div></div><span class="blood-type" aria-label="Blood type A positive">A+</span></article>` }] },
  { id: 'vitals', name: 'Vitals', category: 'Sector · Health', sector: 'health', description: 'Vital signs with normal / watch / alert status — color plus text.',
    classes: { base: 'vitals', parts: ['vital', 'vital-label', 'vital-value', 'vital-unit', 'vital-status'], attributes: ['data-status="watch|alert"'] },
    examples: [{ title: 'Vitals', html: `<div class="vitals">
  <div class="vital"><span class="vital-label">${ic('heart-pulse')} Heart rate</span><span><span class="vital-value">72</span><span class="vital-unit">bpm</span></span><span class="vital-status">Normal</span></div>
  <div class="vital"><span class="vital-label">${ic('activity')} Blood pressure</span><span><span class="vital-value">120/80</span><span class="vital-unit">mmHg</span></span><span class="vital-status">Normal</span></div>
  <div class="vital" data-status="watch"><span class="vital-label">${ic('thermometer')} Temperature</span><span><span class="vital-value">37.9</span><span class="vital-unit">°C</span></span><span class="vital-status">Watch</span></div>
  <div class="vital" data-status="alert"><span class="vital-label">${ic('wind')} SpO₂</span><span><span class="vital-value">91</span><span class="vital-unit">%</span></span><span class="vital-status">Alert</span></div>
</div>` }] },
  { id: 'slots', name: 'Appointment Slots', category: 'Sector · Health', sector: 'health', description: 'Bookable time slots as toggle buttons.',
    classes: { base: 'slots', parts: ['slot', 'slot-time', 'slot-who'] },
    examples: [{ title: 'Slots', html: `<div class="slots" role="group" aria-label="Available times, Thursday"><button class="slot" aria-pressed="false"><span class="slot-time">09:00</span><span class="slot-who">Dr. Öz · Cardiology</span></button><button class="slot" aria-pressed="true"><span class="slot-time">10:30</span><span class="slot-who">Dr. Çelik · Neurology</span></button><button class="slot" disabled><span class="slot-time">11:00</span><span class="slot-who">Booked</span></button></div>` }] },
  { id: 'prescription', name: 'Prescription', category: 'Sector · Health', sector: 'health', description: 'Medication line with dose and refills.',
    classes: { base: 'rx', parts: ['rx-name', 'rx-dose', 'rx-refills'] },
    examples: [{ title: 'Prescriptions', html: `<div class="stack gap-2"><div class="rx">${ic('pill', 'fi-lg fi-accent')}<div><p class="rx-name">Atorvastatin 20 mg</p><p class="rx-dose">1 tablet, evening · 90 days</p></div><span class="rx-refills">2 refills</span></div></div>` }] },
];
