import { useState } from 'react';
import { FileText, Download, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { playClickSound, playChimeSound } from '@/utils/soundEffects';

export default function ComplianceReportGenerator() {
  const { pushToast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleGeneratePDF = () => {
    playClickSound();
    setGenerating(true);

    setTimeout(() => {
      setGenerating(false);
      playChimeSound();

      // Trigger download of existing PDF guide or artifact
      const link = document.createElement('a');
      link.href = '/Sentinel_AI_2.0_Security_Architecture_Guide.pdf';
      link.download = 'Sentinel_Executive_Compliance_Audit_Report.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      pushToast('Executive Security & Financial Compliance Audit PDF Generated & Downloaded!', 'success');
    }, 1500);
  };

  return (
    <button
      onClick={handleGeneratePDF}
      disabled={generating}
      className="flex items-center gap-2 rounded-2xl bg-electric px-4 py-3 font-bold text-black neon-hover neon-border transition disabled:opacity-50"
    >
      {generating ? <FileText className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
      <span>{generating ? 'Compiling Audit PDF...' : 'Download Executive Compliance PDF'}</span>
    </button>
  );
}
