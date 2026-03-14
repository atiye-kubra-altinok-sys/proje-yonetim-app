import { formatDuration } from "../Interfaces/utils";

const StatsBoard = ({ studies }) => {
  const today = new Date().toISOString().split("T")[0];
  const currentMonth = new Date().getMonth();

  const todayMinutes = studies
    .filter((s) => s.date === today)
    .reduce((sum, s) => sum + s.duration, 0);
  const monthlyMinutes = studies
    .filter((s) => new Date(s.date).getMonth() === currentMonth)
    .reduce((sum, s) => sum + s.duration, 0);

  const projectRevenue = {};
  studies.forEach((s) => {
    const income = (s.duration / 60) * s.hourlyRate;
    projectRevenue[s.project] = (projectRevenue[s.project] || 0) + income;
  });

  let topProject = "-";
  let maxRevenue = 0;
  for (const proj in projectRevenue) {
    if (projectRevenue[proj] > maxRevenue) {
      maxRevenue = projectRevenue[proj];
      topProject = proj;
    }
  }

  return (
    <div className="row mb-4">
      {/* Kart 1 */}
      <div className="col-md-4 mb-3">
        <div className="card text-white bg-danger bg-gradient shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <h6 className="card-title text-white-50">Bugünkü Çalışma</h6>
            <h2 className="fw-bold mb-0">{formatDuration(todayMinutes)}</h2>
          </div>
        </div>
      </div>

      {/* Kart 2 */}
      <div className="col-md-4 mb-3">
        <div className="card text-white bg-info bg-gradient shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <h6 className="card-title text-white-50">Bu Ay Toplam</h6>
            <h2 className="fw-bold mb-0">{formatDuration(monthlyMinutes)}</h2>
          </div>
        </div>
      </div>

      {/* Kart 3 */}
      <div className="col-md-4 mb-3">
        <div className="card text-white bg-primary bg-gradient shadow-sm border-0 rounded-4 h-100">
          <div className="card-body">
            <h6 className="card-title text-white-50">En Karlı Proje</h6>
            <h2 className="fw-bold mb-0 text-truncate">{topProject}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBoard;
