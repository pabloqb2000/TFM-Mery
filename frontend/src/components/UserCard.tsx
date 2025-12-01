import { useEffect } from 'react';
import type { User } from "../model/user";
import { clearDriver, showFile } from '../services/driverService';
import { useExecuteDeferred } from '../hooks/useExecuteDeferred';
import './UserCard.css';
import pdfIcon from '../assets/pdf.png';
import imgIcon from '../assets/img.png';
import videoIcon from '../assets/video.png';
import UserExtraDataInput from './UserExtraDataInput';
import { userDataInputs } from '../config/user_data_inputs';
import chooseFirstFile from '../config/choose_first_file';

// Helper function to get file icon based on extension
function getFileIcon(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  if (extension === 'pdf') {
    return pdfIcon;
  } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) {
    return imgIcon;
  } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
    return videoIcon;
  }
  return pdfIcon; // default
}

export default function UserCard({ user }: { user: User | null }) {
  if (!user) {
    return <div className="user-display">Loading user...</div>;
  }
  const userId = user?.Numero_de_cliente;

  // Deferred file loading for initial load (250ms delay)
  const executeDeferredFileLoad = useExecuteDeferred(
    (files: string[], userId: string) => {
      const firstFile = chooseFirstFile(files);
      if (firstFile) {
        showFile(userId, firstFile);
      } else {
        clearDriver();
      }
    },
    500,
  );

  // Deferred file showing for clicks and key presses
  const executeDeferredShowFile = useExecuteDeferred(
    (userId: string, fileName: string) => {
      showFile(userId, fileName);
    },
    250
  );

  useEffect(() => {
    if (user && userId) {
      executeDeferredFileLoad(user.Files || [], userId);
    }
  }, [user, userId, executeDeferredFileLoad])

  // Handle keyboard shortcuts for files
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't handle if user is typing in an input field
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Check if a number key (1-9) was pressed
      const key = event.key;
      if (key >= '1' && key <= '9') {
        const fileIndex = parseInt(key, 10) - 1;
        if (fileIndex >= 0 && fileIndex < user.Files.length) {
          event.preventDefault();
          executeDeferredShowFile(userId, user.Files[fileIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [user.Files, userId, executeDeferredShowFile]);

  const handleFileClick = (fileName: string) => {
    executeDeferredShowFile(userId, fileName);
  };

  return (
    <div className="user-display">
      <div className="user-name-section">
        <a href={user.Profile_url} target="_blank" rel="noopener noreferrer">
          <div className="user-name-label">{user.Nombre} {user.Apellidos}</div>
        </a>
        
        <div className="user-content-grid">
          {/* Files list - 2/3 column */}
          <div className="files-column">
            <div className="files-list">
              {user.Files && user.Files.length > 0 ? (
                user.Files.map((fileName, index) => (
                  <div
                    key={index}
                    className="file-item"
                    onClick={() => handleFileClick(fileName)}
                  >
                    <div className="file-item-content">
                      <img 
                        src={getFileIcon(fileName)} 
                        alt="file icon" 
                        className="file-icon"
                        />
                      <span className="file-name">{fileName}</span>
                    </div>
                    <span className="file-number">{index + 1}</span>
                  </div>
                ))
              ) : (
                <div className="no-files">No files available</div>
              )}
            </div>
          </div>

          {/* User info - 1/3 column */}
          <div className="user-info-column">
            <div className="user-info-grid">
              <div className="user-field">
                <label className={user.Fecha_de_nacimiento ? '' : 'deactivated'} title="Fecha de nacimiento">🎂</label><span title={user.Fecha_de_nacimiento} className={user.Fecha_de_nacimiento ? '' : 'deactivated'}>{user.Fecha_de_nacimiento || 'N/A'}</span>
                <label className={user.Genero ? '' : 'deactivated'} title="Genero">👤</label><span title={user.Genero} className={user.Genero ? '' : 'deactivated'}>{user.Genero || 'N/A'}</span>
              </div>
              <div className="user-field">
                <label className={user.Ano_diagnostico ? '' : 'deactivated'} title="Año de diagnóstico">📅</label><span title={user.Ano_diagnostico} className={user.Ano_diagnostico ? '' : 'deactivated'}>{user.Ano_diagnostico || 'N/A'}</span>
                <label className={user.Diagnostico_previo_aacc ? '' : 'deactivated'} title="Diagnóstico previo aacc">🧪</label><span title={user.Diagnostico_previo_aacc} className={user.Diagnostico_previo_aacc ? '' : 'deactivated'}>{user.Diagnostico_previo_aacc || 'N/A'}</span>
              </div>
              <div className="user-field">
                <label className={user.Tipo_de_colegio ? '' : 'deactivated'} title="Colegio">🏫</label><span title={user.Tipo_de_colegio} className={user.Tipo_de_colegio ? '' : 'deactivated'}>
                  {
                    user.Tipo_de_colegio || user.Colegio ?
                    <><b>{user.Tipo_de_colegio || 'N/A'}</b>: {user.Colegio || 'N/A'}</> :
                    'N/A'
                  }
                </span>
              </div>
              <div className="user-field">
                <label className={user.Medicacion ? '' : 'deactivated'} title="Medicación">💊</label><span title={user.Medicacion} className={user.Medicacion ? '' : 'deactivated'}>{user.Medicacion || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section - 1/1 column */}
        <div className="user-bottom-section">
          <div className="user-field">
            <label className={user.Otros_informes ? '' : 'deactivated'} title="Otros informes">Otros informes:</label>
            <span title={user.Otros_informes} className={user.Otros_informes ? '' : 'deactivated'}>{user.Otros_informes || 'N/A'}</span>
          </div>
          <div className="user-field">
            <label className={user.Centro_diagnostico ? '' : 'deactivated'} title="Centro diagnóstico">Centro diagnóstico:</label>
            <span title={user.Centro_diagnostico} className={user.Centro_diagnostico ? '' : 'deactivated'}>{user.Centro_diagnostico || 'N/A'}</span>
          </div>
          <div className="user-field">
            <label className={user.Reconocido_cmadrid ? '' : 'deactivated'} title="Reconocido cmadrid">Reconocido cmadrid:</label>
            <span title={user.Reconocido_cmadrid} className={user.Reconocido_cmadrid ? '' : 'deactivated'}>{user.Reconocido_cmadrid || 'N/A'}</span>
          </div>
          <div className="user-field">
            <label className={user.En_terapia ? '' : 'deactivated'} title="En terapia">En terapia:</label>
            <span title={user.En_terapia} className={user.En_terapia ? '' : 'deactivated'}>{user.En_terapia || 'N/A'}</span>
          </div>
        </div>

        <div>
          <UserExtraDataInput userId={userId} inputs={userDataInputs} />
        </div>
      </div>
    </div>
  );
}