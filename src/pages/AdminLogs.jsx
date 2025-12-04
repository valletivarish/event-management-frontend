import { useState, useEffect } from 'react';
import { getLogs } from '../services/logService';

function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  useEffect(() => {
    loadLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getLogs(limit, offset);
      setLogs(data.logs || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error('Failed to load logs:', error);
      setLogs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatIpAddress = (ip) => {
    if (!ip) return 'N/A';
    // Convert IPv6 loopback to localhost for better readability
    if (ip === '::1' || ip === '127.0.0.1' || ip === '::ffff:127.0.0.1') {
      return 'localhost';
    }
    return ip;
  };

  return (
    <div>
      <h1>Activity Logs</h1>
      <p>Total logs: {total}</p>

      {loading ? (
        <div className="loading">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="empty-state">No logs found</div>
      ) : (
        <>
          <div>
            {logs.map((log) => (
              <div key={log.id} className="card" style={{ marginBottom: '10px' }}>
                <p><strong>Action:</strong> {log.action}</p>
                <p><strong>User:</strong> {log.user_name || 'System'} ({log.user_email || 'N/A'})</p>
                {log.resource_type && <p><strong>Resource:</strong> {log.resource_type} (ID: {log.resource_id})</p>}
                {log.details && <p><strong>Details:</strong> {log.details}</p>}
                {log.ip_address && <p><strong>IP:</strong> {formatIpAddress(log.ip_address)}</p>}
                <p><strong>Time:</strong> {formatDate(log.created_at)}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="btn btn-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total}
              className="btn btn-secondary"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminLogs;

