import './style.css';

const seedHotels = [
  { id: 1, name: 'StaySphere Marina', city: 'Chennai', type: 'Luxury', rooms: 124, rating: 4.8, price: 6800, status: 'Active' },
  { id: 2, name: 'StaySphere Garden', city: 'Bengaluru', type: 'Business', rooms: 86, rating: 4.6, price: 4200, status: 'Active' },
  { id: 3, name: 'StaySphere Palace', city: 'Hyderabad', type: 'Luxury', rooms: 152, rating: 4.9, price: 7900, status: 'Active' },
  { id: 4, name: 'StaySphere Coast', city: 'Kochi', type: 'Resort', rooms: 64, rating: 4.5, price: 5500, status: 'Active' },
  { id: 5, name: 'StaySphere Central', city: 'Mumbai', type: 'Business', rooms: 110, rating: 4.4, price: 4900, status: 'Maintenance' },
  { id: 6, name: 'StaySphere Hills', city: 'Ooty', type: 'Resort', rooms: 48, rating: 4.7, price: 6100, status: 'Active' }
];
const seedBookings = [
  { id: 501, guest: 'Aarav Sharma', hotelId: 1, room: 'Deluxe', checkin: '2026-10-18', checkout: '2026-10-21', guests: 2, status: 'Confirmed' },
  { id: 502, guest: 'Meera Iyer', hotelId: 3, room: 'Suite', checkin: '2026-10-20', checkout: '2026-10-23', guests: 3, status: 'Confirmed' },
  { id: 503, guest: 'Kabir Rao', hotelId: 2, room: 'Standard', checkin: '2026-10-14', checkout: '2026-10-16', guests: 1, status: 'Pending' }
];
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};
let hotels = read('staysphere_hotels', seedHotels);
let bookings = read('staysphere_bookings', seedBookings);
let activeTab = 'overview';
let searchText = '';
let cityFilter = 'All cities';
let typeFilter = 'All types';
let statusFilter = 'All statuses';
let toastTimer;
const save = () => {
  localStorage.setItem('staysphere_hotels', JSON.stringify(hotels));
  localStorage.setItem('staysphere_bookings', JSON.stringify(bookings));
};
const money = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
const hotelFor = id => hotels.find(h => h.id === Number(id));
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function notify(msg) {
  const el = document.querySelector('#toast');
  if (!el) return;
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
function shell() {
  document.querySelector('#app').innerHTML = `
    <div class="layout">
      <aside class="sidebar">
        <div class="brand"><div class="brand-mark">S</div><div><b>StaySphere</b><small>HOTEL GROUP</small></div></div>
        <div class="side-label">WORKSPACE</div>
        <nav>
          <button class="nav-item ${activeTab==='overview'?'active':''}" data-tab="overview"><span>▦</span> Overview</button>
          <button class="nav-item ${activeTab==='hotels'?'active':''}" data-tab="hotels"><span>⌂</span> Hotel directory</button>
          <button class="nav-item ${activeTab==='bookings'?'active':''}" data-tab="bookings"><span>▣</span> Reservations</button>
        </nav>
        <div class="sidebar-bottom"><div class="help-icon">?</div><div><b>Need a hand?</b><small>Manage your properties with ease.</small></div></div>
      </aside>
      <main class="main">
        <header class="topbar"><div class="crumb">Workspace <span>/</span> <b>${activeTab==='overview'?'Overview':activeTab==='hotels'?'Hotel directory':'Reservations'}</b></div>
        <div class="top-actions"><span class="live-dot"></span><span class="online">System online</span><div class="avatar">HS</div><div class="user-meta"><b>Hotel Admin</b><small>Administrator</small></div><button class="logout" id="logout">Log out ↗</button></div></header>
        <section class="content">${activeTab==='overview'?overview():activeTab==='hotels'?hotelPage():bookingPage()}</section>
      </main>
    </div><div id="toast" class="toast"></div><div id="modal-root"></div>`;
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => { activeTab=b.dataset.tab; shell(); }));
  document.querySelector('#logout').addEventListener('click', loginPage);
  bindPage();
}
function overview() {
  const active = hotels.filter(h=>h.status==='Active').length;
  const confirmed = bookings.filter(b=>b.status==='Confirmed').length;
  const upcoming = bookings.filter(b=>b.checkin >= new Date().toISOString().slice(0,10)).length;
  return `<div class="page-heading"><div><div class="eyebrow">MONDAY, OCTOBER 13, 2026</div><h1>Good afternoon, Admin <span>✦</span></h1><p>Here’s what’s happening across your hotel chain today.</p></div><button class="primary" id="quick-book">＋ New reservation</button></div>
  <div class="stats">
    <article class="stat-card"><div class="stat-top"><span>Total properties</span><span class="stat-icon purple">⌂</span></div><div class="stat-number">${hotels.length}</div><div class="stat-foot"><span class="trend">↗ Chain-wide</span><span>registered hotels</span></div></article>
    <article class="stat-card"><div class="stat-top"><span>Active properties</span><span class="stat-icon green">✓</span></div><div class="stat-number">${active}</div><div class="stat-foot"><span class="trend green-text">● Operational</span><span>ready for guests</span></div></article>
    <article class="stat-card"><div class="stat-top"><span>Reservations</span><span class="stat-icon orange">▣</span></div><div class="stat-number">${bookings.length}</div><div class="stat-foot"><span class="trend">↗ ${confirmed} confirmed</span><span>all statuses</span></div></article>
    <article class="stat-card"><div class="stat-top"><span>Upcoming check-ins</span><span class="stat-icon blue">↗</span></div><div class="stat-number">${upcoming}</div><div class="stat-foot"><span class="trend">Next arrivals</span><span>from today onward</span></div></article>
  </div>
  <div class="section-head"><div><h2>Hotel portfolio</h2><p>Quick view of properties in your chain.</p></div><button class="text-btn" id="view-hotels">View all hotels →</button></div>
  <div class="hotel-grid">${hotels.slice(0,3).map(hotelCard).join('')}</div>
  <div class="section-head booking-head"><div><h2>Recent reservations</h2><p>Latest guest bookings across locations.</p></div><button class="text-btn" id="view-bookings">View reservations →</button></div>
  ${bookingTable(bookings.slice().sort((a,b)=>b.id-a.id).slice(0,4))}`;
}
function hotelCard(h) {
  const art = h.type==='Luxury'?'luxury':h.type==='Resort'?'resort':'business';
  return `<article class="hotel-card"><div class="hotel-art ${art}"><span class="hotel-type">${esc(h.type)}</span><span class="hotel-rating">★ ${h.rating}</span><div class="art-caption">${esc(h.city)}<small>STAYSPHERE COLLECTION</small></div></div><div class="hotel-info"><div><h3>${esc(h.name)}</h3><p>⌖ ${esc(h.city)}, India</p></div><span class="status ${h.status==='Active'?'ok':'warn'}">${esc(h.status)}</span></div><div class="hotel-details"><span>▦ ${h.rooms} rooms</span><span>From <b>${money(h.price)}</b> / night</span></div></article>`;
}
function hotelPage() {
  const cities = ['All cities', ...new Set(hotels.map(h=>h.city).sort())];
  const filtered = hotels.filter(h => `${h.name} ${h.city} ${h.type} ${h.status}`.toLowerCase().includes(searchText.toLowerCase()) && (cityFilter==='All cities'||h.city===cityFilter) && (typeFilter==='All types'||h.type===typeFilter) && (statusFilter==='All statuses'||h.status===statusFilter));
  return `<div class="page-heading"><div><div class="eyebrow">PROPERTY MANAGEMENT</div><h1>Hotel directory</h1><p>Search, filter and manage every property in your chain.</p></div><button class="primary" id="add-hotel">＋ Add hotel</button></div>
  <div class="filter-panel"><div class="search-box"><span>⌕</span><input id="search" placeholder="Search hotel, city or type..." value="${esc(searchText)}"></div>
  <select id="city-filter">${cities.map(c=>`<option ${cityFilter===c?'selected':''}>${esc(c)}</option>`).join('')}</select>
  <select id="type-filter">${['All types','Luxury','Business','Resort'].map(c=>`<option ${typeFilter===c?'selected':''}>${c}</option>`).join('')}</select>
  <select id="status-filter">${['All statuses','Active','Maintenance'].map(c=>`<option ${statusFilter===c?'selected':''}>${c}</option>`).join('')}</select>
  <button class="reset-btn" id="reset-filter">Reset</button></div>
  <div class="result-line"><span><b>${filtered.length}</b> properties found</span><span>Sort: <b>Property name</b></span></div>
  <div class="hotel-grid">${filtered.length?filtered.map(hotelCard).join(''):'<div class="empty">No hotels match these filters. Try another search.</div>'}</div>
  <div class="table-panel"><div class="table-title"><div><h2>Property details</h2><p>Operational data and nightly starting rates.</p></div></div>${hotelTable(filtered)}</div>`;
}
function hotelTable(list) {
  return `<div class="table-wrap"><table><thead><tr><th>PROPERTY</th><th>CITY</th><th>TYPE</th><th>ROOMS</th><th>RATE / NIGHT</th><th>STATUS</th><th>ACTIONS</th></tr></thead><tbody>${list.map(h=>`<tr><td><b>${esc(h.name)}</b><small class="cell-sub">ID #HT${h.id}</small></td><td>${esc(h.city)}</td><td>${esc(h.type)}</td><td>${h.rooms}</td><td>${money(h.price)}</td><td><span class="status ${h.status==='Active'?'ok':'warn'}">${h.status}</span></td><td><button class="small-action edit-hotel" data-id="${h.id}">Edit</button><button class="small-action danger delete-hotel" data-id="${h.id}">Delete</button></td></tr>`).join('')||'<tr><td colspan="7">No properties found.</td></tr>'}</tbody></table></div>`;
}
function bookingPage() {
  const filtered = bookings.filter(b=>`${b.guest} ${hotelFor(b.hotelId)?.name||''} ${b.room} ${b.status}`.toLowerCase().includes(searchText.toLowerCase()) && (statusFilter==='All statuses'||b.status===statusFilter));
  return `<div class="page-heading"><div><div class="eyebrow">GUEST EXPERIENCE</div><h1>Reservations</h1><p>Track guest stays and booking status across all properties.</p></div><button class="primary" id="add-booking">＋ New reservation</button></div>
  <div class="filter-panel"><div class="search-box"><span>⌕</span><input id="search" placeholder="Search guest, hotel or room..." value="${esc(searchText)}"></div><select id="status-filter">${['All statuses','Confirmed','Pending','Cancelled'].map(c=>`<option ${statusFilter===c?'selected':''}>${c}</option>`).join('')}</select><button class="reset-btn" id="reset-filter">Reset</button></div>
  <div class="table-panel"><div class="table-title"><div><h2>All reservations</h2><p>${filtered.length} matching bookings</p></div><span class="table-note">Changes are saved in this browser</span></div>${bookingTable(filtered,true)}</div>`;
}
function bookingTable(list, actions=false) {
 return `<div class="table-wrap"><table><thead><tr><th>BOOKING</th><th>GUEST</th><th>PROPERTY</th><th>ROOM</th><th>CHECK-IN</th><th>CHECK-OUT</th><th>STATUS</th>${actions?'<th>ACTIONS</th>':''}</tr></thead><tbody>${list.map(b=>`<tr><td><b>#BK${b.id}</b></td><td>${esc(b.guest)}</td><td>${esc(hotelFor(b.hotelId)?.name||'Removed hotel')}</td><td>${esc(b.room)}</td><td>${esc(b.checkin)}</td><td>${esc(b.checkout)}</td><td><span class="status ${b.status==='Confirmed'?'ok':b.status==='Pending'?'warn':'bad'}">${esc(b.status)}</span></td>${actions?`<td><button class="small-action edit-booking" data-id="${b.id}">Edit</button><button class="small-action danger delete-booking" data-id="${b.id}">Delete</button></td>`:''}</tr>`).join('')||`<tr><td colspan="${actions?8:7}">No reservations found.</td></tr>`}</tbody></table></div>`;
}
function bindPage() {
  document.querySelector('#view-hotels')?.addEventListener('click',()=>{activeTab='hotels';searchText='';shell()});
  document.querySelector('#view-bookings')?.addEventListener('click',()=>{activeTab='bookings';searchText='';shell()});
  document.querySelector('#quick-book')?.addEventListener('click',()=>bookingModal());
  document.querySelector('#add-booking')?.addEventListener('click',()=>bookingModal());
  document.querySelector('#add-hotel')?.addEventListener('click',()=>hotelModal());
  document.querySelector('#search')?.addEventListener('input',e=>{searchText=e.target.value; const pos=e.target.selectionStart; shell(); const n=document.querySelector('#search'); n?.focus(); n?.setSelectionRange(pos,pos);});
  document.querySelector('#city-filter')?.addEventListener('change',e=>{cityFilter=e.target.value;shell()});
  document.querySelector('#type-filter')?.addEventListener('change',e=>{typeFilter=e.target.value;shell()});
  document.querySelector('#status-filter')?.addEventListener('change',e=>{statusFilter=e.target.value;shell()});
  document.querySelector('#reset-filter')?.addEventListener('click',()=>{searchText='';cityFilter='All cities';typeFilter='All types';statusFilter='All statuses';shell()});
  document.querySelectorAll('.edit-hotel').forEach(b=>b.addEventListener('click',()=>hotelModal(Number(b.dataset.id))));
  document.querySelectorAll('.delete-hotel').forEach(b=>b.addEventListener('click',()=>deleteHotel(Number(b.dataset.id))));
  document.querySelectorAll('.edit-booking').forEach(b=>b.addEventListener('click',()=>bookingModal(Number(b.dataset.id))));
  document.querySelectorAll('.delete-booking').forEach(b=>b.addEventListener('click',()=>deleteBooking(Number(b.dataset.id))));
}
function showModal(title, body, onSubmit) {
 const root=document.querySelector('#modal-root');
 root.innerHTML=`<div class="modal-backdrop"><div class="modal"><div class="modal-head"><div><div class="eyebrow">STAYSPHERE MANAGEMENT</div><h2>${title}</h2></div><button class="close-modal" type="button">×</button></div><form id="data-form">${body}<div class="modal-actions"><button type="button" class="secondary close-modal">Cancel</button><button class="primary" type="submit">Save changes</button></div></form></div></div>`;
 root.querySelectorAll('.close-modal').forEach(b=>b.addEventListener('click',()=>root.innerHTML=''));
 root.querySelector('.modal-backdrop').addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))root.innerHTML=''});
 root.querySelector('#data-form').addEventListener('submit',e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.target));onSubmit(data);});
}
const field = (label,name,value='',type='text',required=true,extra='') => `<label class="field">${label}<input name="${name}" type="${type}" value="${esc(value)}" ${required?'required':''} ${extra}></label>`;
const selectField = (label,name,options,value) => `<label class="field">${label}<select name="${name}" required>${options.map(o=>`<option value="${o}" ${String(value)===String(o)?'selected':''}>${o}</option>`).join('')}</select></label>`;
function hotelModal(id) {
 const h=hotels.find(x=>x.id===id)||{name:'',city:'',type:'Business',rooms:50,rating:4.5,price:4000,status:'Active'};
 showModal(id?'Edit hotel':'Add a hotel',`<div class="form-grid">${field('Hotel name','name',h.name)}${field('City','city',h.city)}${selectField('Property type','type',['Luxury','Business','Resort'],h.type)}${field('Number of rooms','rooms',h.rooms,'number',true,'min="1"')}${field('Guest rating','rating',h.rating,'number',true,'min="1" max="5" step="0.1"')}${field('Starting price (₹ / night)','price',h.price,'number',true,'min="1"')}${selectField('Status','status',['Active','Maintenance'],h.status)}</div>`,d=>{
   const item={id:id||Math.max(0,...hotels.map(x=>x.id))+1,name:d.name.trim(),city:d.city.trim(),type:d.type,rooms:Number(d.rooms),rating:Number(d.rating),price:Number(d.price),status:d.status};
   if(id)hotels=hotels.map(x=>x.id===id?item:x);else hotels.push(item);
   save();shell();notify(id?'Hotel updated successfully':'Hotel added successfully');
 });
}
function bookingModal(id) {
 const b=bookings.find(x=>x.id===id)||{guest:'',hotelId:hotels[0]?.id||'',room:'Deluxe',checkin:'2026-10-18',checkout:'2026-10-20',guests:2,status:'Confirmed'};
 showModal(id?'Edit reservation':'New reservation',`<div class="form-grid">${field('Guest full name','guest',b.guest)}<label class="field">Hotel<select name="hotelId" required>${hotels.map(h=>`<option value="${h.id}" ${Number(b.hotelId)===h.id?'selected':''}>${esc(h.name)} — ${esc(h.city)}</option>`).join('')}</select></label>${selectField('Room category','room',['Standard','Deluxe','Suite','Family'],b.room)}${field('Check-in','checkin',b.checkin,'date')}${field('Check-out','checkout',b.checkout,'date')}${field('Number of guests','guests',b.guests,'number',true,'min="1"')}${selectField('Booking status','status',['Confirmed','Pending','Cancelled'],b.status)}</div>`,d=>{
   if(d.checkout<=d.checkin){notify('Check-out must be after check-in');return;}
   if(!hotels.some(h=>h.id===Number(d.hotelId))){notify('Please add a hotel first');return;}
   const item={id:id||Math.max(500,...bookings.map(x=>x.id))+1,guest:d.guest.trim(),hotelId:Number(d.hotelId),room:d.room,checkin:d.checkin,checkout:d.checkout,guests:Number(d.guests),status:d.status};
   if(id)bookings=bookings.map(x=>x.id===id?item:x);else bookings.push(item);
   save();shell();notify(id?'Reservation updated':'Reservation created successfully');
 });
}
function deleteHotel(id) {
 const h=hotelFor(id); if(!h)return;
 if(bookings.some(b=>b.hotelId===id)){notify('Cannot delete: this hotel has reservations. Delete or reassign them first.');return;}
 if(confirm(`Delete ${h.name}? This cannot be undone.`)){hotels=hotels.filter(x=>x.id!==id);save();shell();notify('Hotel deleted');}
}
function deleteBooking(id) { if(confirm('Delete this reservation?')){bookings=bookings.filter(b=>b.id!==id);save();shell();notify('Reservation deleted');} }
function loginPage() {
 document.querySelector('#app').innerHTML=`<div class="login-screen"><div class="login-art"><div class="login-brand"><div class="brand-mark">S</div><div><b>StaySphere</b><small>HOTEL GROUP</small></div></div><div class="login-quote"><span>THE ART OF HOSPITALITY</span><h1>Every stay,<br>an exceptional<br><em>story.</em></h1><p>One connected view of every property, every guest, every experience.</p></div><div class="login-bottom">HOSPITALITY, REIMAGINED <span>© 2026 STAYSPHERE</span></div></div><div class="login-side"><div class="login-form"><div class="mobile-brand"><div class="brand-mark">S</div><b>StaySphere</b></div><div class="eyebrow">WELCOME BACK</div><h2>Sign in to your workspace</h2><p>Enter your administrator credentials to continue.</p><form id="login-form"><label class="field">Email address<input name="email" type="email" placeholder="admin@staysphere.com" required value="admin@staysphere.com"></label><label class="field">Password<div class="password-wrap"><input id="password" name="password" type="password" placeholder="Enter password" required value="admin123"><button type="button" id="toggle-pass">Show</button></div></label><div class="login-options"><label class="remember"><input type="checkbox" checked> Remember me</label><span>Demo environment</span></div><button class="primary login-submit" type="submit">Sign in <span>→</span></button><div class="demo-note"><span>ⓘ</span><div><b>Demo login</b><br>Email: admin@staysphere.com<br>Password: admin123</div></div></form><div class="login-footer">Secure workspace · Hotel Chain Management</div></div></div></div>`;
 document.querySelector('#toggle-pass').addEventListener('click',()=>{const p=document.querySelector('#password');p.type=p.type==='password'?'text':'password';document.querySelector('#toggle-pass').textContent=p.type==='password'?'Show':'Hide'});
 document.querySelector('#login-form').addEventListener('submit',e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));if(d.email==='admin@staysphere.com'&&d.password==='admin123'){activeTab='overview';shell()}else{const old=document.querySelector('.login-error');old?.remove();document.querySelector('#login-form').insertAdjacentHTML('afterbegin','<div class="login-error">Invalid credentials. Use the demo login shown below.</div>')}});
}
loginPage();