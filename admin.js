// admin.js : localStorage থেকে ডেটা লোড, শিক্ষক ও বেতন ম্যানেজমেন্ট (সব বাংলা UI)
function aid(x){return document.getElementById(x)}
aid('loadStudents').addEventListener('click', function(){
  const students = JSON.parse(localStorage.getItem('madrasa_students') || '[]');
  const tbl = aid('stuTable');
  if(students.length===0){ tbl.innerHTML = '<tr><td>কোনো স্টুডেন্ট নেই</td></tr>'; return; }
  let html = '<tr><th>ID</th><th>নাম</th><th>ক্লাস</th><th>মোবাইল</th></tr>';
  students.forEach(s => {
    html += `<tr><td>${s.id}</td><td>${s.name}</td><td>${s.cls}</td><td>${s.phone}</td></tr>`;
  });
  tbl.innerHTML = html;
});

aid('addTeacher').addEventListener('click', function(){
  const name = aid('tname').value.trim(), sal = parseFloat(aid('tsalary').value || 0);
  if(!name || !sal){ alert('শিক্ষকের নাম ও বেতন প্রদান করুন'); return; }
  const teachers = JSON.parse(localStorage.getItem('madrasa_teachers')||'[]');
  teachers.push({id:'T'+Date.now(), name:name, salary:sal, paid:0});
  localStorage.setItem('madrasa_teachers', JSON.stringify(teachers));
  aid('tname').value=''; aid('tsalary').value='';
  renderTeachers();
});

function renderTeachers(){
  const teachers = JSON.parse(localStorage.getItem('madrasa_teachers')||'[]');
  const div = aid('teachersList');
  if(teachers.length===0){ div.innerHTML='<p>কোনও শিক্ষক নেই</p>'; return; }
  let html='<table border="1" cellpadding="6" style="width:100%"><tr><th>ID</th><th>নাম</th><th>বেতন (BDT)</th><th>অ্যাকশন</th></tr>';
  teachers.forEach(t=>{
    html += `<tr><td>${t.id}</td><td>${t.name}</td><td>${t.salary}</td><td><button onclick="payTeacher('${t.id}')">বেতন প্রদান</button></td></tr>`;
  });
  html += '</table>';
  div.innerHTML = html;
}
window.payTeacher = function(id){
  const teachers = JSON.parse(localStorage.getItem('madrasa_teachers')||'[]');
  const t = teachers.find(x=>x.id===id); if(!t){ alert('শিক্ষক পাওয়া যায়নি'); return; }
  const amt = prompt('প্রদেয় পরিমাণ (BDT):', t.salary);
  if(!amt) return;
  t.paid = (t.paid || 0) + parseFloat(amt);
  localStorage.setItem('madrasa_teachers', JSON.stringify(teachers));
  alert('বেতন রেকর্ড সম্পন্ন হয়েছে');
  renderTeachers();
}

aid('exportData').addEventListener('click', function(){
  const payload = {
    students: JSON.parse(localStorage.getItem('madrasa_students')||'[]'),
    teachers: JSON.parse(localStorage.getItem('madrasa_teachers')||'[]'),
    txs: JSON.parse(localStorage.getItem('madrasa_txs')||'[]')
  };
  const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href=url; a.download='madrasa_data_export.json'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});
renderTeachers();
