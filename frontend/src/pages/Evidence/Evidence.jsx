import { useState, useEffect } from 'react';
import { FileSearch, CheckCircle2, AlertCircle, XCircle, ChevronRight, Loader2 } from 'lucide-react';
import EvidenceDetail from '../../components/EvidenceDetail/EvidenceDetail';

export default function Evidence() {
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [evidenceData, setEvidenceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAllEvidence = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/candidates');
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.error || 'Failed to fetch verification data');
        const candidate = data.candidates?.[0];
        if (!candidate) throw new Error('Upload and verify a profile first.');
        const combinedEvidence = candidate.evidence;
        if (!Array.isArray(combinedEvidence)) throw new Error('Stored evidence is unavailable. Restart the updated verification backend.');

        // Map visual states and icons
        const formattedData = combinedEvidence.map(item => {
          let uiStyle = {};
          if (item.status === 'Verified') {
            uiStyle = { icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50', barColor: 'bg-green-500' };
          } else if (item.status === 'Partial Evidence') {
            uiStyle = { icon: AlertCircle, color: 'text-yellow-600', bg: 'bg-yellow-50', barColor: 'bg-yellow-500' };
          } else {
            uiStyle = { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', barColor: 'bg-red-500' };
          }
          return { ...item, ...uiStyle };
        });

        formattedData.sort((a, b) => b.score - a.score);
        setEvidenceData(formattedData);

      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllEvidence();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold text-[#53041B]">Evidence Analysis</h1>
        <p className="text-[#770429] mt-1">Stored results: GitHub uses repository-name matching; LinkedIn reflects supplied profile data.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#C92D68]/40 shadow-sm p-2 sm:p-6 min-h-[400px]">
        <div className="flex items-center gap-3 mb-6 p-4 sm:p-0 border-b sm:border-0 border-gray-100 pb-4">
          <div className="bg-[#F8D8E3]/40 p-2 rounded-lg">
            <FileSearch className="w-6 h-6 text-[#770429]" />
          </div>
          <div>
            <h2 className="font-bold text-[#53041B] text-xl">Verification Engine</h2>
            <p className="text-sm text-gray-500">Click any row to inspect verified sources.</p>
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <Loader2 className="w-10 h-10 text-[#BB2649] animate-spin" />
            <p className="text-[#770429] font-medium animate-pulse">Analyzing GitHub Repos & Professional Footprint...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 p-6 rounded-xl border border-red-200 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <h3 className="text-red-700 font-bold">Engine Error</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="space-y-3">
            {evidenceData.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedSkill(item)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-[#FDF0F4]/30 hover:border-[#C92D68]/50 transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <div className="flex items-center gap-4 mb-4 sm:mb-0">
                  <div className={`${item.bg} p-2 rounded-full shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#53041B] text-lg">{item.skill}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <span className={`font-medium ${item.color}`}>{item.status}</span> 
                      • {item.sources} verified items
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex flex-col items-end w-32 sm:w-40">
                    <div className="flex justify-between w-full text-sm font-semibold mb-1 text-[#770429]">
                      <span>Confidence</span>
                      <span>{item.score}%</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${item.barColor}`} 
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#770429] transition-colors shrink-0" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSkill && (
        <EvidenceDetail 
          data={selectedSkill} 
          onClose={() => setSelectedSkill(null)} 
        />
      )}
    </div>
  );
}
