/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";

const ProjectModal = ({ isOpen, onClose, onSave, editingProject }) => {
  const [project, setProject] = useState("");
  const [duration, setDuration] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (editingProject) {
      setProject(editingProject.project);
      setDuration(editingProject.duration);
      setHourlyRate(editingProject.hourlyRate);
      setDate(editingProject.date);
    } else {
      setProject("");
      setDuration("");
      setHourlyRate("");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [editingProject, isOpen]);

  const handleSave = () => {
    if (!project || !duration || !hourlyRate || !date) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    onSave({
      id: editingProject ? editingProject.id : Date.now().toString(),
      project,
      duration: parseInt(duration),
      hourlyRate: parseFloat(hourlyRate),
      date,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Arka planı karartan katman */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal'ın kendisi */}
      <div className="modal fade show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 pb-0">
              <h5 className="modal-title fw-bold">
                {editingProject ? "Proje Düzenle" : "Yeni Proje Ekle"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Proje Adı
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Örn: E-Ticaret"
                  value={project}
                  onChange={(e) => setProject(e.target.value)}
                />
              </div>

              <div className="row">
                <div className="col-6 mb-3">
                  <label className="form-label text-muted small fw-bold">
                    Süre (Dk)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="120"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                  />
                </div>
                <div className="col-6 mb-3">
                  <label className="form-label text-muted small fw-bold">
                    Saatlik (₺)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="500"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label text-muted small fw-bold">
                  Tarih
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-footer border-top-0 pt-0">
              <button
                type="button"
                className="btn btn-light rounded-pill px-4"
                onClick={onClose}
              >
                İptal
              </button>
              <button
                type="button"
                className="btn btn-primary rounded-pill px-4"
                onClick={handleSave}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;
