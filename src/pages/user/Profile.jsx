import { useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, onValue, update, set } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { database, auth } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import avatarJack from '../../assets/avatar-jack.jpg';
import { validateLicensePlate } from '../../utils/validation';
import './Profile.css';

function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [form, setForm] = useState(() => {
    try {
      if (!user?.uid) return { name: '', phone: '' };
      return {
        name: localStorage.getItem(`velox_user_name_${user.uid}`) || user?.displayName || '',
        phone: localStorage.getItem(`velox_user_phone_${user.uid}`) || user?.phoneNumber || '',
      };
    } catch {
      return { name: '', phone: '' };
    }
  });
  const [plates, setPlates] = useState(() => {
    try {
      if (!user?.uid) return [];
      const raw = localStorage.getItem(`velox_user_plates_${user.uid}`);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [newPlate, setNewPlate] = useState('');
  const [selectedVehType, setSelectedVehType] = useState('car');
  const [vehicleNickname, setVehicleNickname] = useState('');
  const [vehicleMeta, setVehicleMeta] = useState(() => {
    try {
      if (!user?.uid) return {};
      const raw = localStorage.getItem(`velox_user_meta_${user.uid}`);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [addingVehicle, setAddingVehicle] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [anprActive, setAnprActive] = useState(true);
  const [notifsActive, setNotifsActive] = useState(true);
  const [stats, setStats] = useState({ sessions: 0, hours: 0, spent: 0 });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const toastTimer = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    setToastVisible(true);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToastVisible(false);
    }, 2800);
  };

  const openAddVehicleModal = () => {
    setShowAddVehicleModal(true);
  };

  // Open modal if directed from Dashboard
  useEffect(() => {
    if (location.state?.openAddVehicle) {
      setShowAddVehicleModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    return () => clearTimeout(toastTimer.current);
  }, []);

  // Fetch User info from Realtime Database + sync with user-scoped localStorage
  useEffect(() => {
    // Purge legacy un-scoped localStorage items so they cannot leak
    try {
      localStorage.removeItem('velox_user_name');
      localStorage.removeItem('velox_user_phone');
      localStorage.removeItem('velox_user_plates');
      localStorage.removeItem('velox_user_meta');
    } catch {}

    if (!user?.uid) {
      setForm({ name: '', phone: '' });
      setPlates([]);
      setVehicleMeta({});
      return;
    }

    // Try user-specific local storage immediately
    try {
      const uidName = localStorage.getItem(`velox_user_name_${user.uid}`) || user?.displayName || '';
      const uidPhone = localStorage.getItem(`velox_user_phone_${user.uid}`) || user?.phoneNumber || '';
      setForm({
        name: uidName,
        phone: uidPhone,
      });
      const uidPlates = localStorage.getItem(`velox_user_plates_${user.uid}`);
      const uidMeta = localStorage.getItem(`velox_user_meta_${user.uid}`);
      setPlates(uidPlates ? JSON.parse(uidPlates) : []);
      setVehicleMeta(uidMeta ? JSON.parse(uidMeta) : {});
    } catch {}

    const userRef = ref(database, `users/${user.uid}`);
    const unsub = onValue(userRef, (snap) => {
      if (snap.exists()) {
        const data = snap.val();
        const loadedName = data.name !== undefined ? data.name : (localStorage.getItem(`velox_user_name_${user.uid}`) || user?.displayName || '');
        const loadedPhone = data.phone !== undefined ? data.phone : (localStorage.getItem(`velox_user_phone_${user.uid}`) || user?.phoneNumber || '');
        setForm({
          name: loadedName,
          phone: loadedPhone,
        });
        if (loadedName) {
          try {
            localStorage.setItem(`velox_user_name_${user.uid}`, loadedName);
          } catch {}
        }
        if (loadedPhone) {
          try {
            localStorage.setItem(`velox_user_phone_${user.uid}`, loadedPhone);
          } catch {}
        }
        if (Array.isArray(data.vehiclePlates)) {
          setPlates(data.vehiclePlates);
          try {
            localStorage.setItem(`velox_user_plates_${user.uid}`, JSON.stringify(data.vehiclePlates));
          } catch {}
        } else {
          // If vehiclePlates field is not yet set in RTDB, check ONLY this user's scoped localStorage
          try {
            const raw = localStorage.getItem(`velox_user_plates_${user.uid}`);
            if (raw) {
              const localList = JSON.parse(raw);
              setPlates(Array.isArray(localList) ? localList : []);
            } else {
              setPlates([]);
            }
          } catch {
            setPlates([]);
          }
        }
        if (data.vehicleMeta && typeof data.vehicleMeta === 'object') {
          setVehicleMeta(data.vehicleMeta);
          try {
            localStorage.setItem(`velox_user_meta_${user.uid}`, JSON.stringify(data.vehicleMeta));
          } catch {}
        } else {
          try {
            const rawMeta = localStorage.getItem(`velox_user_meta_${user.uid}`);
            setVehicleMeta(rawMeta ? JSON.parse(rawMeta) : {});
          } catch {
            setVehicleMeta({});
          }
        }
      } else {
        const fallbackName = localStorage.getItem(`velox_user_name_${user.uid}`) || user?.displayName || '';
        const fallbackPhone = localStorage.getItem(`velox_user_phone_${user.uid}`) || user?.phoneNumber || '';
        setForm({
          name: fallbackName,
          phone: fallbackPhone,
        });
        setPlates([]);
        setVehicleMeta({});
      }
    });
    return () => unsub();
  }, [user]);

  // Fetch Bookings for Stats from Realtime Database
  useEffect(() => {
    if (!user?.uid) {
      setStats({ sessions: 0, hours: 0, spent: 0 });
      return;
    }
    try {
      const bookingsRef = ref(database, 'bookings');
      const unsub = onValue(bookingsRef, (snap) => {
        if (snap.exists()) {
          const all = snap.val();
          let count = 0;
          let totalMins = 0;
          let totalCost = 0;
          Object.values(all).forEach((b) => {
            if (b && (b.userId === user.uid || b.uid === user.uid)) {
              count += 1;
              totalMins += Number(b.duration) || 60;
              totalCost += Number(b.amount) || 40;
            }
          });
          setStats({
            sessions: count,
            hours: Math.round(totalMins / 60),
            spent: totalCost,
          });
        } else {
          setStats({ sessions: 0, hours: 0, spent: 0 });
        }
      });
      return () => unsub();
    } catch {
      setStats({ sessions: 0, hours: 0, spent: 0 });
    }
  }, [user]);

  const handleAddPlate = async (customPlate) => {
    const raw = typeof customPlate === 'string' ? customPlate : newPlate;
    const plateCheck = validateLicensePlate(raw);
    if (!plateCheck.valid) {
      showToast(plateCheck.message || 'Invalid plate format');
      return;
    }
    const clean = plateCheck.cleaned;
    if (plates.includes(clean)) {
      showToast('Plate already exists in your garage');
      return;
    }
    setAddingVehicle(true);
    const updated = [...plates, clean];
    const defaultLabels = {
      car: 'Personal Car',
      bike: 'Royal Enfield / Two-Wheeler',
      ev: 'Electric Vehicle',
      truck: 'Commercial Vehicle',
    };
    const updatedMeta = {
      ...vehicleMeta,
      [clean]: {
        type: selectedVehType,
        nickname: vehicleNickname.trim() || defaultLabels[selectedVehType] || 'Personal Vehicle',
      },
    };

    setPlates(updated);
    setVehicleMeta(updatedMeta);
    setNewPlate('');
    setVehicleNickname('');
    setShowAddVehicleModal(false);

    // Save strictly in user-scoped localStorage
    if (user?.uid) {
      try {
        localStorage.setItem(`velox_user_plates_${user.uid}`, JSON.stringify(updated));
        localStorage.setItem(`velox_user_meta_${user.uid}`, JSON.stringify(updatedMeta));
        window.dispatchEvent(new Event('velox_vehicles_updated'));
      } catch (e) {
        console.warn('LocalStorage save error:', e);
      }

      // Save permanently in Realtime Database under users/${user.uid}
      try {
        await set(ref(database, `users/${user.uid}/vehiclePlates`), updated);
        await set(ref(database, `users/${user.uid}/vehicleMeta`), updatedMeta);
        await set(ref(database, `users/${user.uid}/updatedAt`), new Date().toISOString());
      } catch (err) {
        console.error('Realtime Database update error:', err);
      }
    }
    setAddingVehicle(false);
    showToast(`✓ Vehicle ${clean} added successfully`);
  };

  const handleDeletePlate = async (plateToDelete) => {
    if (!plateToDelete) return;
    const confirmDelete = window.confirm(`Remove vehicle ${plateToDelete} from your profile?`);
    if (!confirmDelete) return;

    const updated = plates.filter((p) => p !== plateToDelete);
    const updatedMeta = { ...vehicleMeta };
    delete updatedMeta[plateToDelete];

    setPlates(updated);
    setVehicleMeta(updatedMeta);

    if (user?.uid) {
      try {
        localStorage.setItem(`velox_user_plates_${user.uid}`, JSON.stringify(updated));
        localStorage.setItem(`velox_user_meta_${user.uid}`, JSON.stringify(updatedMeta));
        window.dispatchEvent(new Event('velox_vehicles_updated'));
      } catch (e) {
        console.warn('LocalStorage delete error:', e);
      }

      try {
        await set(ref(database, `users/${user.uid}/vehiclePlates`), updated);
        await set(ref(database, `users/${user.uid}/vehicleMeta`), updatedMeta);
        await set(ref(database, `users/${user.uid}/updatedAt`), new Date().toISOString());
      } catch (err) {
        console.error('Realtime Database delete vehicle notice:', err);
      }
    }

    showToast(`✓ Removed vehicle ${plateToDelete}`);
  };

  const handleSetDefaultPlate = async (idx) => {
    if (idx === 0) return;
    const item = plates[idx];
    const rest = plates.filter((_, i) => i !== idx);
    const updated = [item, ...rest];
    setPlates(updated);

    if (user?.uid) {
      try {
        localStorage.setItem(`velox_user_plates_${user.uid}`, JSON.stringify(updated));
        window.dispatchEvent(new Event('velox_vehicles_updated'));
      } catch (e) {}

      try {
        await set(ref(database, `users/${user.uid}/vehiclePlates`), updated);
      } catch (err) {}
    }
    showToast(`✓ Set ${item} as default vehicle`);
  };

  const handleSaveProfile = async (e) => {
    e?.preventDefault?.();
    setSaving(true);

    const trimmedName = (form.name || '').trim();
    const trimmedPhone = (form.phone || '').trim();

    // 1. Immediately store in user-scoped localStorage
    if (user?.uid) {
      try {
        localStorage.setItem(`velox_user_name_${user.uid}`, trimmedName);
        localStorage.setItem(`velox_user_phone_${user.uid}`, trimmedPhone);
        window.dispatchEvent(new Event('velox_profile_updated'));
      } catch (err) {
        console.warn('LocalStorage save error:', err);
      }
    }

    // 2. Update state and close modal immediately
    setForm({
      name: trimmedName,
      phone: trimmedPhone,
    });
    setSaving(false);
    setShowEditProfileModal(false);
    showToast('✓ Profile updated successfully');

    // 3. Save to Realtime Database under users/${user.uid}
    if (user?.uid) {
      try {
        await set(ref(database, `users/${user.uid}/name`), trimmedName);
        await set(ref(database, `users/${user.uid}/phone`), trimmedPhone);
        if (user.email) {
          await set(ref(database, `users/${user.uid}/email`), user.email);
        }
        await set(ref(database, `users/${user.uid}/updatedAt`), new Date().toISOString());
      } catch (err) {
        console.error('Realtime Database profile save notice:', err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      if (user?.uid) {
        localStorage.removeItem(`velox_active_session_${user.uid}`);
      }
      // Purge legacy un-scoped items
      localStorage.removeItem('velox_user_name');
      localStorage.removeItem('velox_user_phone');
      localStorage.removeItem('velox_user_plates');
      localStorage.removeItem('velox_user_meta');
      setForm({ name: '', phone: '' });
      setPlates([]);
      setVehicleMeta({});
      await signOut(auth);
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const displayName = form.name || user?.displayName || user?.email?.split('@')[0] || 'User';
  const phoneDisplay = form.phone || '';
  const emailDisplay = user?.email || 'user@veloxpark.in';

  return (
    <div className="stitch-profile-page">
      {/* Top Fixed Header */}
      <header className="stitch-profile-top-bar">
        <div className="stitch-profile-top-inner">
          <div className="stitch-logo-group" onClick={() => navigate('/dashboard')}>
            <div className="stitch-logo-p">P</div>
            <div className="stitch-brand-col">
              <span className="stitch-brand-name">VeloxPark</span>
              <span className="stitch-brand-sub">Profile</span>
            </div>
          </div>
          <div className="stitch-top-actions">
            <button
              type="button"
              className="stitch-action-btn"
              aria-label="Notifications"
              onClick={() => showToast('FASTag auto-verification synced')}
            >
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="stitch-avatar-btn">
              <img src={avatarJack} alt="Profile" className="stitch-avatar-img" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Scroll Content */}
      <main className="stitch-profile-main">
        <div className="stitch-profile-content">
          {/* Left Column (Desktop sidebar / mobile direct flow) */}
          <div className="stitch-profile-col-left">
            {/* Top Profile Card & Identity */}
            <section className="stitch-id-card">
              <div className="stitch-id-blur-orb top-right" />
              <div className="stitch-id-blur-orb bottom-left" />

              <div className="stitch-id-avatar-cluster">
                <img src={avatarJack} alt={displayName} className="stitch-id-avatar-img" />
                <span className="stitch-id-verified-badge" title="Verified Account">
                  <span className="material-symbols-outlined filled">verified</span>
                </span>
              </div>

              <h1 className="stitch-id-name">{displayName}</h1>
              <p className="stitch-id-contact">
                {phoneDisplay ? `${phoneDisplay} • ` : ''}{emailDisplay}
              </p>

              <div className="stitch-id-actions-row">
                <button
                  type="button"
                  className="stitch-id-edit-btn"
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <span className="material-symbols-outlined">edit</span>
                  <span>Edit profile</span>
                </button>

                <span className="stitch-id-fastag-pill">
                  <span className="material-symbols-outlined filled">bolt</span>
                  <span>FASTag Active</span>
                </span>
              </div>
            </section>

            {/* High-Density Quick Analytics Strip (Hidden if fresh user has 0 sessions) */}
            {stats.sessions > 0 && (
              <section className="stitch-stats-strip">
                <div className="stitch-stat-tile" onClick={() => navigate('/history')}>
                  <span className="stitch-stat-number">{stats.sessions}</span>
                  <span className="stitch-stat-sub">Total Parkings</span>
                </div>
                <div className="stitch-stat-tile">
                  <span className="stitch-stat-number">{stats.hours} hrs</span>
                  <span className="stitch-stat-sub">Hours Parked</span>
                </div>
                <div className="stitch-stat-tile">
                  <span className="stitch-stat-number">₹{stats.spent.toLocaleString()}</span>
                  <span className="stitch-stat-sub">Money Spent</span>
                </div>
              </section>
            )}

            {/* Logout Section for Left Column on Desktop */}
            <section className="stitch-logout-section desktop-logout">
              <button
                type="button"
                className="stitch-logout-btn"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Log out</span>
              </button>

              <div className="stitch-version-tag">
                VeloxPark v2.4.1 (Gujarat Smart Mobility Edition)
              </div>
            </section>
          </div>

          {/* Right Column (Vehicles, Rates, Settings) */}
          <div className="stitch-profile-col-right">
            {/* My Vehicles Ribbon Section */}
            <section className="stitch-vehicles-section">
            <div className="stitch-sec-head">
              <div className="stitch-sec-title-wrap">
                <h2 className="stitch-sec-title">My Vehicles</h2>
                <span className="stitch-veh-count-badge">({plates.length})</span>
              </div>
              <button
                type="button"
                className="stitch-sec-action-link"
                onClick={openAddVehicleModal}
              >
                <span>+ Add</span>
                <span className="material-symbols-outlined">add</span>
              </button>
            </div>

            {/* Horizontal Snap Scroll Strip or Fresh Empty State */}
            {plates.length > 0 ? (
              <div className="stitch-vehicles-snap-strip">
                {plates.map((plate, index) => {
                  const isDefault = index === 0;
                  const meta = vehicleMeta[plate];
                  const isBike = meta ? meta.type === 'bike' : false;
                  const isEv = meta ? meta.type === 'ev' : false;
                  const isTruck = meta ? meta.type === 'truck' : false;
                  const iconName = isBike ? 'two_wheeler' : isEv ? 'electric_car' : isTruck ? 'local_shipping' : 'directions_car';
                  const modelName = meta?.nickname || (isBike ? 'Two-Wheeler' : 'Personal Vehicle');

                  return (
                    <div key={plate} className="stitch-vehicle-card">
                      <div className="stitch-veh-card-top">
                        <div className="stitch-veh-icon-box">
                          <span className="material-symbols-outlined">{iconName}</span>
                        </div>
                        <div className="stitch-veh-card-top-actions">
                          {isDefault ? (
                            <span className="stitch-veh-default-tag">
                              <span className="stitch-pulse-micro" />
                              Default
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="stitch-veh-set-default-btn"
                              onClick={() => handleSetDefaultPlate(index)}
                            >
                              Set default
                            </button>
                          )}
                          <button
                            type="button"
                            className="stitch-veh-delete-btn"
                            title={`Delete vehicle ${plate}`}
                            aria-label={`Delete vehicle ${plate}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePlate(plate);
                            }}
                          >
                            <span className="material-symbols-outlined">delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Realistic Indian HSRP License Plate */}
                      <div className="stitch-hsrp-full-plate">
                        <div className="stitch-hsrp-ind-strip">
                          <div className="stitch-hsrp-chakra" />
                          <span className="stitch-hsrp-ind-text">IND</span>
                        </div>
                        <div className="stitch-hsrp-plate-number">{plate}</div>
                      </div>

                      <div className="stitch-veh-card-footer">
                        <span className="stitch-veh-model-name">{modelName}</span>
                        <span
                          className={`material-symbols-outlined ${
                            isDefault ? 'filled text-success' : 'text-muted'
                          }`}
                        >
                          {isDefault ? 'check_circle' : 'radio_button_unchecked'}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Add Vehicle CTA Card */}
                <div
                  className="stitch-vehicle-add-card"
                  onClick={openAddVehicleModal}
                >
                  <div className="stitch-veh-add-icon-circle">
                    <span className="material-symbols-outlined">add</span>
                  </div>
                  <span className="stitch-veh-add-title">+ Add Vehicle</span>
                  <span className="stitch-veh-add-sub">Fast HSRP OCR</span>
                </div>
              </div>
            ) : (
              <div className="stitch-empty-vehicles-box" onClick={openAddVehicleModal}>
                <div className="stitch-empty-veh-icon-wrap">
                  <span className="material-symbols-outlined">directions_car</span>
                </div>
                <div className="stitch-empty-veh-info">
                  <span className="stitch-empty-veh-title">No vehicles added yet</span>
                  <p className="stitch-empty-veh-desc">
                    Register your vehicle license plate to enable touchless ANPR boom barrier entry and auto-parking.
                  </p>
                </div>
                <button
                  type="button"
                  className="stitch-empty-veh-cta-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddVehicleModal();
                  }}
                >
                  <span className="material-symbols-outlined">add</span>
                  <span>Add First Vehicle</span>
                </button>
              </div>
            )}
          </section>

          {/* iOS-Style Grouped Settings List */}
          <section className="stitch-settings-grouped-list">
            {/* Item 1: Payment Methods */}
            <div
              className="stitch-setting-row"
              onClick={() => showToast('UPI, Fastag & Cards ready')}
            >
              <div className="stitch-setting-left">
                <div className="stitch-setting-icon-wrap">
                  <span className="material-symbols-outlined">account_balance_wallet</span>
                </div>
                <div className="stitch-setting-info">
                  <span className="stitch-setting-title">Payment Methods</span>
                  <span className="stitch-setting-desc">
                    UPI, Google Pay, Fastag Auto-Debit
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined stitch-chev">chevron_right</span>
            </div>

            <div className="stitch-setting-divider" />

            {/* Item 2: Parking History */}
            <div className="stitch-setting-row" onClick={() => navigate('/history')}>
              <div className="stitch-setting-left">
                <div className="stitch-setting-icon-wrap">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div className="stitch-setting-info">
                  <span className="stitch-setting-title">Parking History &amp; Invoices</span>
                  <span className="stitch-setting-desc">GST receipts &amp; session logs</span>
                </div>
              </div>
              <span className="material-symbols-outlined stitch-chev">chevron_right</span>
            </div>

            <div className="stitch-setting-divider" />

            {/* Item 3: ANPR Auto-Barrier Access Toggle */}
            <div className="stitch-setting-row non-clickable">
              <div className="stitch-setting-left">
                <div className="stitch-setting-icon-wrap">
                  <span className="material-symbols-outlined">sensor_occupied</span>
                </div>
                <div className="stitch-setting-info">
                  <div className="stitch-smart-tag-row">
                    <span className="stitch-setting-title">ANPR Auto-Barrier Access</span>
                    <span className="stitch-smart-pill">Smart</span>
                  </div>
                  <span className="stitch-setting-desc">Touchless boom barrier auto lift</span>
                </div>
              </div>
              <button
                type="button"
                className={`stitch-switch ${anprActive ? 'active' : ''}`}
                onClick={() => setAnprActive(!anprActive)}
                aria-pressed={anprActive}
                aria-label="Toggle ANPR"
              >
                <span className="stitch-switch-knob" />
              </button>
            </div>

            <div className="stitch-setting-divider" />

            {/* Item 4: Notifications & Alerts Toggle */}
            <div className="stitch-setting-row non-clickable">
              <div className="stitch-setting-left">
                <div className="stitch-setting-icon-wrap">
                  <span className="material-symbols-outlined">notifications_active</span>
                </div>
                <div className="stitch-setting-info">
                  <span className="stitch-setting-title">Notifications &amp; Alerts</span>
                  <span className="stitch-setting-desc">
                    15-min expiry warnings &amp; receipts
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={`stitch-switch ${notifsActive ? 'active' : ''}`}
                onClick={() => setNotifsActive(!notifsActive)}
                aria-pressed={notifsActive}
                aria-label="Toggle notifications"
              >
                <span className="stitch-switch-knob" />
              </button>
            </div>

            <div className="stitch-setting-divider" />

            {/* Item 5: Help & Support */}
            <div
              className="stitch-setting-row"
              onClick={() => showToast('Toll-free 1800-233-VELOX (24x7 Helpdesk)')}
            >
              <div className="stitch-setting-left">
                <div className="stitch-setting-icon-wrap">
                  <span className="material-symbols-outlined">support_agent</span>
                </div>
                <div className="stitch-setting-info">
                  <span className="stitch-setting-title">Help &amp; Gujarat 24x7 Support</span>
                  <span className="stitch-setting-desc">Toll-free 1800-233-VELOX</span>
                </div>
              </div>
              <span className="material-symbols-outlined stitch-chev">chevron_right</span>
            </div>

            <div className="stitch-setting-divider" />

            {/* Item 6: Terms & Privacy */}
            <div
              className="stitch-setting-row"
              onClick={() => showToast('Municipal compliance & RTO approved')}
            >
              <div className="stitch-setting-left">
                <div className="stitch-setting-icon-wrap">
                  <span className="material-symbols-outlined">policy</span>
                </div>
                <div className="stitch-setting-info">
                  <span className="stitch-setting-title">Terms &amp; Privacy Policy</span>
                  <span className="stitch-setting-desc">
                    Municipal compliance, NDMC &amp; RTO
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined stitch-chev">chevron_right</span>
            </div>
          </section>

            {/* Logout Button & Version Tag (Mobile Bottom Flow) */}
            <section className="stitch-logout-section mobile-logout">
              <button
                type="button"
                className="stitch-logout-btn"
                onClick={handleLogout}
              >
                <span className="material-symbols-outlined">logout</span>
                <span>Log out</span>
              </button>
              <div className="stitch-version-tag">
                VeloxPark v2.4.1 (Gujarat Smart Mobility Edition)
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal */}
      {showEditProfileModal && (
        <div className="stitch-modal-overlay" onClick={() => setShowEditProfileModal(false)}>
          <div className="stitch-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="stitch-modal-title">Edit Profile</h3>
            <form onSubmit={handleSaveProfile} className="stitch-modal-form">
              <div className="stitch-form-group">
                <label>FULL NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div className="stitch-form-group">
                <label>PHONE NUMBER (INDIA)</label>
                <div className="stitch-phone-input-group">
                  <div className="stitch-phone-prefix-badge">
                    <span className="stitch-flag-icon">🇮🇳</span>
                    <span>+91</span>
                  </div>
                  <input
                    type="tel"
                    value={form.phone.replace(/^\+91\s?/, '')}
                    onChange={(e) => {
                      let digits = e.target.value.replace(/\D/g, '');
                      if (digits.startsWith('91') && digits.length > 10) {
                        digits = digits.slice(2);
                      }
                      digits = digits.slice(0, 10);
                      setForm({ ...form, phone: digits ? `+91 ${digits}` : '' });
                    }}
                    placeholder="98765 43210"
                    maxLength={10}
                    aria-label="Indian 10-digit mobile number"
                  />
                </div>
              </div>
              <div className="stitch-modal-actions">
                <button
                  type="button"
                  className="stitch-btn-cancel"
                  onClick={() => setShowEditProfileModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="stitch-btn-submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Vehicle Popup / Bottom Sheet Modal */}
      {showAddVehicleModal && (
        <div
          className="stitch-add-vehicle-overlay"
          onClick={() => setShowAddVehicleModal(false)}
        >
          <div
            className="stitch-add-vehicle-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="stitch-sheet-handle-bar" />

            <div className="stitch-sheet-header">
              <div className="stitch-sheet-title-group">
                <h3 className="stitch-sheet-title">Add Vehicle</h3>
                <span className="stitch-anpr-ready-tag">
                  <span className="stitch-pulse-micro" />
                  ANPR &amp; FASTag Ready
                </span>
              </div>
              <button
                type="button"
                className="stitch-sheet-close-btn"
                onClick={() => setShowAddVehicleModal(false)}
                aria-label="Close"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Vehicle Type Selector Tabs */}
            <div className="stitch-veh-type-pills">
              <button
                type="button"
                className={`stitch-veh-type-btn ${selectedVehType === 'car' ? 'active' : ''}`}
                onClick={() => setSelectedVehType('car')}
              >
                <span className="material-symbols-outlined">directions_car</span>
                <span>Car</span>
              </button>
              <button
                type="button"
                className={`stitch-veh-type-btn ${selectedVehType === 'bike' ? 'active' : ''}`}
                onClick={() => setSelectedVehType('bike')}
              >
                <span className="material-symbols-outlined">two_wheeler</span>
                <span>Bike</span>
              </button>
              <button
                type="button"
                className={`stitch-veh-type-btn ${selectedVehType === 'ev' ? 'active' : ''}`}
                onClick={() => setSelectedVehType('ev')}
              >
                <span className="material-symbols-outlined">electric_car</span>
                <span>EV</span>
              </button>
              <button
                type="button"
                className={`stitch-veh-type-btn ${selectedVehType === 'truck' ? 'active' : ''}`}
                onClick={() => setSelectedVehType('truck')}
              >
                <span className="material-symbols-outlined">local_shipping</span>
                <span>Commercial</span>
              </button>
            </div>

            {/* Modal Add Vehicle Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlate();
              }}
              className="stitch-inline-add-form"
            >
              {/* Realistic Indian HSRP Plate Input */}
              <div className="stitch-form-field-wrap">
                <label className="stitch-field-label">INDIAN HSRP REGISTRATION NUMBER</label>
                <div className="stitch-inline-hsrp-input-group">
                  <div className="stitch-inline-hsrp-badge">
                    <div className="stitch-hsrp-chakra" />
                    <span>IND</span>
                  </div>
                  <input
                    type="text"
                    className="stitch-inline-hsrp-input"
                    placeholder="GJ 23 AB 1234"
                    value={newPlate}
                    onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                    maxLength={16}
                    autoFocus
                    aria-label="Vehicle Plate Number"
                  />
                  {newPlate && (
                    <button
                      type="button"
                      className="stitch-inline-clear-btn"
                      onClick={() => setNewPlate('')}
                      aria-label="Clear input"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Vehicle Nickname / Model */}
              <div className="stitch-form-field-wrap">
                <label className="stitch-field-label">VEHICLE MODEL / NICKNAME (OPTIONAL)</label>
                <div className="stitch-inline-model-input-group">
                  <span className="material-symbols-outlined stitch-model-input-icon">
                    {selectedVehType === 'bike'
                      ? 'two_wheeler'
                      : selectedVehType === 'ev'
                      ? 'electric_car'
                      : selectedVehType === 'truck'
                      ? 'local_shipping'
                      : 'directions_car'}
                  </span>
                  <input
                    type="text"
                    className="stitch-inline-model-input"
                    placeholder="e.g. Hyundai Creta, Tata Nexon EV, Activa 6G"
                    value={vehicleNickname}
                    onChange={(e) => setVehicleNickname(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="stitch-inline-submit-btn"
                disabled={!newPlate.trim() || addingVehicle}
              >
                <span className="material-symbols-outlined">add_circle</span>
                <span>{addingVehicle ? 'Adding Vehicle…' : 'Add Vehicle to Garage'}</span>
              </button>
            </form>

            {/* ANPR Auto Access Note */}
            <div className="stitch-add-veh-info-banner">
              <span className="material-symbols-outlined stitch-info-icon">sensor_occupied</span>
              <span className="stitch-info-text">
                Your plate will be auto-recognized by ANPR cameras for touchless boom barrier access.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toast Popup */}
      <div className={`stitch-profile-toast ${toastVisible ? 'visible' : ''}`}>
        {toast}
      </div>
    </div>
  );
}

export default Profile;
