import { useState, useEffect, useRef } from "react";
import {
  formatDuration,
  formatCurrency,
  formatDate,
} from "../Interfaces/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  // --- STATE VE REF YÖNETİMİ ---
  const [studies, setStudies] = useState(() => {
    const saved = localStorage.getItem("studies");
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [project, setProject] = useState("");
  const [duration, setDuration] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [editingId, setEditingId] = useState(null);

  // Hem tablo hem de Operasyon Merkezi (Header) için referanslar
  const tableRef = useRef(null);
  const headerRef = useRef(null); // YENİ: Başlık için referans eklendi

  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("studies", JSON.stringify(studies));
  }, [studies]);

  // YENİ: Doğrudan Operasyon Merkezine kaydıran fonksiyon
  const scrollToHeader = (e) => {
    if (e) e.preventDefault();

    // Eğer sayfa zaten üstteyse sayfayı yenile
    if (window.scrollY < 10) {
      window.location.reload();
    } else {
      // Değilse yukarı kaydır
      headerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setIsMobileMenuOpen(false);
  };

  const scrollToTable = (e) => {
    if (e) e.preventDefault();
    tableRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setIsMobileMenuOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setProject("");
    setDuration("");
    setHourlyRate("");
    setDate(new Date().toISOString().split("T")[0]);
  };

  // --- İSTATİSTİKLER ---
  const today = new Date().toISOString().split("T")[0];
  const totalMinutes = studies.reduce((sum, s) => sum + s.duration, 0);
  const chartData = studies.map((s) => ({
    name: s.project,
    Kazanç: (s.duration / 60) * s.hourlyRate,
  }));

  // --- İŞLEMLER ---
  const handleSave = () => {
    if (!project || !duration || !hourlyRate || !date) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    const newStudy = {
      id: editingId ? editingId : Date.now().toString(),
      project,
      duration: parseInt(duration),
      hourlyRate: parseFloat(hourlyRate),
      date,
    };
    if (editingId) {
      setStudies(studies.map((s) => (s.id === editingId ? newStudy : s)));
    } else {
      setStudies([...studies, newStudy]);
    }
    handleCloseModal();
  };

  const handleEdit = (study) => {
    setEditingId(study.id);
    setProject(study.project);
    setDuration(study.duration);
    setHourlyRate(study.hourlyRate);
    setDate(study.date);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setStudies(studies.filter((s) => s.id !== id));
  };

  return (
    <div
      className="d-flex"
      style={{ minHeight: "100vh", position: "relative" }}
    >
      {isMobileMenuOpen && (
        <div
          className="modal-backdrop fade show d-md-none"
          style={{ zIndex: 1040 }}
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* 1. SOL SİDEBAR */}
      <div
        className={`theme-sidebar p-4 flex-column shadow-sm transition-all ${isMobileMenuOpen ? "position-fixed start-0 top-0 h-100 d-flex" : "d-none d-md-flex"}`}
        style={{ width: "260px", zIndex: 1050 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-5">
          <h4 className="fw-bolder text-primary mb-0">
            <i className="bi bi-lightning-charge-fill me-2"></i>Üret, ölç, Kazan
          </h4>
          <button
            className="btn btn-sm btn-light d-md-none"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <i className="bi bi-x-lg fw-bold"></i>
          </button>
        </div>

        <div className="d-flex flex-column gap-3 mb-auto">
          {/* YENİ: Dashboard butonu artık scrollToHeader fonksiyonunu çağırıyor */}
          <a
            href="#"
            onClick={scrollToHeader}
            className="text-decoration-none fw-bold p-2 rounded-3 bg-primary text-white hover-lift"
          >
            <i className="bi bi-house-fill me-2"></i> Paneli Yenile
          </a>
          <a
            href="#"
            onClick={scrollToTable}
            className="text-decoration-none fw-bold p-2 rounded-3 text-muted theme-card border-0 hover-lift"
          >
            <i className="bi bi-folder-fill me-2"></i> Projeler
          </a>
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn btn-outline-secondary w-100 fw-bold rounded-pill"
          >
            {isDarkMode ? (
              <>
                <i className="bi bi-sun-fill text-warning me-2"></i> Light Mode
              </>
            ) : (
              <>
                <i className="bi bi-moon-stars-fill text-dark me-2"></i> Dark
                Mode
              </>
            )}
          </button>
        </div>
      </div>

      {/* SAĞ ANA İÇERİK ALANI */}
      <div
        className="flex-grow-1"
        style={{ overflowY: "auto", height: "100vh" }}
      >
        <div
          className="d-md-none d-flex justify-content-between align-items-center p-3 theme-card shadow-sm sticky-top"
          style={{ zIndex: 1000 }}
        >
          <h5 className="fw-bolder text-primary mb-0">
            <i className="bi bi-lightning-charge-fill me-2"></i>Zamanın kontrolü
            sende, kazancın kayıt altında.
          </h5>
          <button
            className="btn btn-light border-0 px-2 py-1 rounded-3"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <i className="bi bi-list fs-3"></i>
          </button>
        </div>

        <div className="container-fluid max-w-1200 mx-auto p-3 p-md-5">
          {/* 2. HAREKETLİ BAŞLIK (headerRef buraya eklendi) */}
          <div
            ref={headerRef}
            style={{ scrollMarginTop: "80px" }}
            className="animated-header py-5 px-4 mb-4 text-white d-flex justify-content-between align-items-center flex-wrap gap-3"
          >
            <div>
              <h1 className="display-6 fw-bolder mb-2">
                {" "}
                Verimlilik Paneli ⚡️
              </h1>
              <p className="lead fw-normal text-white-50 mb-0 opacity-75">
                Zamanını nakde dönüştürmeye devam et. <br /> Projelerin ve
                performansın bir arada.
              </p>
            </div>
            <div className="text-end d-none d-sm-block">
              <h5 className="mb-0 fw-bold">{formatDate(today)}</h5>
              <small className="opacity-75">
                <i className="bi bi-clock"></i> Aktif Oturum
              </small>
            </div>
          </div>

          {/* 3. YENİ PROJE EKLE BUTONU */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <h5 className="fw-bolder text-muted mb-0"> Performans Özeti </h5>
            <button
              className="btn btn-primary fw-bold px-4 py-2 rounded-pill btn-neon-purple shadow-sm d-flex align-items-center gap-2"
              onClick={() => setIsModalOpen(true)}
            >
              <i className="bi bi-plus-lg fs-5"></i> Yeni Proje Ekle
            </button>
          </div>

          {/* 4. İSTATİSTİKLER & GRAFİK */}
          <div className="row g-4 mb-5">
            <div className="col-lg-4">
              <div className="d-flex flex-column gap-4 h-100">
                <div
                  className="card theme-card border-0 rounded-4 shadow-sm hover-lift p-3"
                  onClick={scrollToTable}
                  style={{ cursor: "pointer" }}
                  title="Tabloya Git"
                >
                  <div className="card-body">
                    <h6 className="text-muted fw-bold mb-3">
                      <i className="bi bi-briefcase-fill text-primary me-2"></i>
                      Toplam Proje
                    </h6>
                    <h1 className="fw-black text-primary mb-0 display-4">
                      {studies.length}
                    </h1>
                  </div>
                </div>
                <div className="card theme-card border-0 rounded-4 shadow-sm hover-lift p-3">
                  <div className="card-body">
                    <h6 className="text-muted fw-bold mb-3">
                      <i className="bi bi-stopwatch-fill text-success me-2"></i>
                      Toplam Mesai
                    </h6>
                    <h2 className="fw-black text-success mb-0 display-5">
                      {formatDuration(totalMinutes)}
                    </h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card theme-card border-0 rounded-4 shadow-sm h-100 p-3">
                <div className="card-body">
                  <h6 className="text-muted fw-bold mb-4">
                    <i className="bi bi-graph-up-arrow text-info me-2"></i>Gelir
                    Analizi
                  </h6>
                  <div style={{ width: "100%", height: 200 }}>
                    {studies.length > 0 ? (
                      <ResponsiveContainer>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis
                            dataKey="name"
                            stroke={isDarkMode ? "#cbd5e1" : "#64748b"}
                            fontSize={12}
                          />
                          <Tooltip
                            cursor={{ fill: "transparent" }}
                            contentStyle={{
                              borderRadius: "10px",
                              backgroundColor: isDarkMode ? "#1e293b" : "#fff",
                            }}
                          />
                          <Bar
                            dataKey="Kazanç"
                            fill="#6366f1"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="d-flex h-100 align-items-center justify-content-center text-muted">
                        Grafik için veri bekleniyor...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. TABLO YAPISI */}
          <div ref={tableRef} style={{ scrollMarginTop: "80px" }}>
            <h5 className="fw-bold mb-4 mt-5">
              <i className="bi bi-card-list text-primary me-2"></i>Aktif
              Projeler Listesi
            </h5>
            <div className="card theme-card border-0 shadow-sm rounded-4 overflow-hidden mb-5">
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-borderless table-hover align-middle mb-0 text-nowrap">
                    <thead
                      className=""
                      style={{
                        backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
                      }}
                    >
                      <tr>
                        <th
                          className={`py-4 text-start ps-4 font-monospace text-uppercase small ${isDarkMode ? "text-light" : "text-muted"}`}
                        >
                          Proje
                        </th>
                        <th
                          className={`py-4 text-center font-monospace text-uppercase small ${isDarkMode ? "text-light" : "text-muted"}`}
                        >
                          Süre
                        </th>
                        <th
                          className={`py-4 text-center font-monospace text-uppercase small ${isDarkMode ? "text-light" : "text-muted"}`}
                        >
                          Saatlİk Ücret
                        </th>
                        <th
                          className={`py-4 text-center font-monospace text-uppercase small ${isDarkMode ? "text-light" : "text-muted"}`}
                        >
                          Tarİh
                        </th>
                        <th
                          className={`py-4 text-center font-monospace text-uppercase small ${isDarkMode ? "text-light" : "text-muted"}`}
                        >
                          Kazanç
                        </th>
                        <th
                          className={`py-4 text-center pe-4 font-monospace text-uppercase small ${isDarkMode ? "text-light" : "text-muted"}`}
                        >
                          İşlem
                        </th>
                      </tr>
                    </thead>
                    <tbody className="border-top-0">
                      {studies.length === 0 ? (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-5 text-center text-muted"
                          >
                            <i className="bi bi-inbox fs-1 d-block mb-3"></i>{" "}
                            Kayıt bulunamadı.
                          </td>
                        </tr>
                      ) : (
                        studies.map((study) => {
                          const income =
                            (study.duration / 60) * study.hourlyRate;
                          return (
                            <tr
                              key={study.id}
                              className="animate-slide-in border-bottom"
                              style={{
                                borderColor: isDarkMode ? "#334155" : "#e2e8f0",
                              }}
                            >
                              <td className="text-start ps-4 fw-bold">
                                <i className="bi bi-journal-code text-primary me-2"></i>
                                {study.project}
                              </td>
                              <td className="text-center">
                                <span className="badge bg-primary bg-opacity-10 text-primary py-2 px-3 rounded-pill">
                                  <i className="bi bi-clock-history me-1"></i>
                                  {formatDuration(study.duration)}
                                </span>
                              </td>
                              <td className="text-center text-secondary fw-medium">
                                {formatCurrency(study.hourlyRate)}
                              </td>
                              <td className="text-center text-secondary fw-medium">
                                {formatDate(study.date)}
                              </td>
                              <td className="text-center fw-bolder text-success">
                                {formatCurrency(income)}
                              </td>
                              <td className="text-center pe-4">
                                <div className="d-flex justify-content-center gap-2">
                                  <button
                                    className="btn btn-sm rounded-pill px-3 fw-bold btn-neon-purple text-primary"
                                    style={{
                                      backgroundColor: isDarkMode
                                        ? "#1e293b"
                                        : "#E0E7FF",
                                    }}
                                    onClick={() => handleEdit(study)}
                                  >
                                    <i className="bi bi-pencil-square me-1"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm rounded-pill px-3 fw-bold btn-neon-red text-danger"
                                    style={{
                                      backgroundColor: isDarkMode
                                        ? "#1e293b"
                                        : "#FFE4E6",
                                    }}
                                    onClick={() => handleDelete(study.id)}
                                  >
                                    <i className="bi bi-trash3-fill me-1"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. AÇILIR PENCERE (MODAL) EKRANI */}
      {isModalOpen && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1050 }}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1060 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content theme-card border-0 rounded-4 shadow-lg animate-slide-in">
                <div className="modal-header border-bottom-0 pt-4 pb-0 px-4">
                  <h4 className="fw-bolder">
                    <i className="bi bi-window-stack text-primary me-2"></i>
                    {editingId ? "Projeyi Güncelle" : "Yeni Proje Ekle"}
                  </h4>
                  <button
                    type="button"
                    className={`btn-close ${isDarkMode ? "btn-close-white" : ""}`}
                    onClick={handleCloseModal}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-4">
                    <div className="col-12">
                      <label className="form-label text-muted small fw-bold">
                        Proje Adı
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3 theme-input"
                        value={project}
                        onChange={(e) => setProject(e.target.value)}
                        placeholder="Örn: Mobil Uygulama Arayüzü"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold">
                        Çalışılan Süre (Dk)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 theme-input"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="120"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold">
                        Saatlik Ücret (₺)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg rounded-3 theme-input"
                        value={hourlyRate}
                        onChange={(e) => setHourlyRate(e.target.value)}
                        placeholder="500"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold">
                        Kayıt Tarihi
                      </label>
                      <input
                        type="date"
                        className="form-control form-control-lg rounded-3 theme-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-top-0 pb-4 px-4 gap-2">
                  <button
                    className="btn btn-light btn-lg rounded-pill fw-bold px-4"
                    onClick={handleCloseModal}
                  >
                    İptal
                  </button>
                  <button
                    className="btn btn-primary btn-lg rounded-pill px-5 fw-bold btn-neon-purple shadow-sm"
                    onClick={handleSave}
                  >
                    <i className="bi bi-save2-fill me-2"></i>{" "}
                    {editingId ? "Değişiklikleri Kaydet" : "Sisteme Ekle"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
