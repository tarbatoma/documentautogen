import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, FileText, TrendingUp, DollarSign, Calendar, 
  AlertCircle, Users, Receipt, Percent, Package
} from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState('sumar-lunar');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [reportData, setReportData] = useState(null);

  const reports = [
    { 
      id: 'sumar-lunar',
      name: 'Sumar Financiar Lunar',
      description: 'Vizualizare rapidă a situației financiare lunare',
      icon: DollarSign
    },
    {
      id: 'facturi-neincasate',
      name: 'Facturi Neîncasate',
      description: 'Evidența facturilor neplătite și restante',
      icon: AlertCircle
    },
    {
      id: 'raport-anual',
      name: 'Raport Anual Consolidat',
      description: 'Situația financiară anuală pentru contabilitate',
      icon: Receipt
    },
    {
      id: 'raport-clienti',
      name: 'Raport Clienți',
      description: 'Analiza vânzărilor per client',
      icon: Users
    },
    {
      id: 'raport-tva',
      name: 'Raport TVA',
      description: 'Calcul TVA colectat pentru declarații',
      icon: Percent
    },
    {
      id: 'raport-produse',
      name: 'Raport Produse și Servicii',
      description: 'Analiza vânzărilor per produs/serviciu',
      icon: Package
    }
  ];

  useEffect(() => {
    if (selectedReport && startDate) {
      fetchReportData();
    }
  }, [selectedReport, startDate, endDate]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      // Get the start and end dates
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      
      let end;
      if (endDate) {
        end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
      } else if (selectedReport === 'raport-anual') {
        end = new Date(start.getFullYear(), 11, 31, 23, 59, 59, 999);
      } else {
        end = new Date(start);
        end.setHours(23, 59, 59, 999);
      }

      // Base query
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'factura')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString());

      // Add specific filters based on report type
      if (selectedReport === 'facturi-neincasate') {
        query = query.eq('status', 'neincasat');
      }

      const { data, error } = await query;
      if (error) throw error;

      // Process data based on report type
      let processedData = {
        totalDocuments: data.length,
        subtotal: 0,
        tva: 0,
        total: 0,
        items: [],
        clients: {},
        unpaidInvoices: [],
        documents: data // Add raw documents for TVA report
      };

      data.forEach(doc => {
        const docData = doc.document_data;
        
        // Calculate totals from items
        let documentSubtotal = 0;
        let documentTva = 0;
        let documentTotal = 0;

        if (docData.items && Array.isArray(docData.items)) {
          docData.items.forEach(item => {
            const itemTotal = parseFloat(item.cantitate) * parseFloat(item.pret_unitar);
            documentSubtotal += itemTotal;

            // Process for products report
            if (selectedReport === 'raport-produse') {
              const existingItem = processedData.items.find(i => i.descriere === item.descriere);
              if (existingItem) {
                existingItem.cantitate += parseFloat(item.cantitate);
                existingItem.valoare += itemTotal;
              } else {
                processedData.items.push({
                  descriere: item.descriere,
                  cantitate: parseFloat(item.cantitate),
                  valoare: itemTotal
                });
              }
            }
          });

          // Calculate document TVA and total
          documentTva = documentSubtotal * 0.19;
          documentTotal = documentSubtotal + documentTva;
        }

        // Process for clients report
        if (selectedReport === 'raport-clienti' && docData.nume_client) {
          if (!processedData.clients[docData.nume_client]) {
            processedData.clients[docData.nume_client] = {
              numarFacturi: 0,
              subtotal: 0,
              tva: 0,
              total: 0
            };
          }

          const client = processedData.clients[docData.nume_client];
          client.numarFacturi++;
          client.subtotal += documentSubtotal;
          client.tva += documentTva;
          client.total += documentTotal;
        }

        // Process for unpaid invoices
        if (selectedReport === 'facturi-neincasate') {
          processedData.unpaidInvoices.push({
            numar: docData.serie_numar,
            client: docData.nume_client,
            total: documentTotal,
            dataScadenta: docData.data_scadenta,
            zileIntarziere: Math.floor((new Date() - new Date(docData.data_scadenta)) / (1000 * 60 * 60 * 24))
          });
        }

        // Add to overall totals
        processedData.subtotal += documentSubtotal;
        processedData.tva += documentTva;
        processedData.total += documentTotal;
      });

      setReportData(processedData);
    } catch (error) {
      console.error('Error fetching report data:', error);
      toast.error('Eroare la generarea raportului');
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;

    let csvContent = '';
    const dateStr = startDate.toLocaleDateString('ro-RO');
    
    switch (selectedReport) {
      case 'sumar-lunar':
      case 'raport-anual':
        csvContent = 'Indicator,Valoare\n';
        csvContent += `Număr Facturi,${reportData.totalDocuments}\n`;
        csvContent += `Subtotal,${reportData.subtotal.toFixed(2)} RON\n`;
        csvContent += `TVA,${reportData.tva.toFixed(2)} RON\n`;
        csvContent += `Total,${reportData.total.toFixed(2)} RON\n`;
        break;

      case 'facturi-neincasate':
        csvContent = 'Număr Factură,Client,Total,Data Scadentă,Zile Întârziere\n';
        reportData.unpaidInvoices.forEach(invoice => {
          csvContent += `${invoice.numar},${invoice.client},${invoice.total},${invoice.dataScadenta},${invoice.zileIntarziere}\n`;
        });
        break;

      case 'raport-clienti':
        csvContent = 'Client,Număr Facturi,Subtotal,TVA,Total\n';
        Object.entries(reportData.clients).forEach(([client, data]) => {
          csvContent += `${client},${data.numarFacturi},${data.subtotal.toFixed(2)},${data.tva.toFixed(2)},${data.total.toFixed(2)}\n`;
        });
        break;

      case 'raport-produse':
        csvContent = 'Produs/Serviciu,Cantitate,Valoare,TVA,Total\n';
        reportData.items.forEach(item => {
          const tva = item.valoare * 0.19;
          const total = item.valoare + tva;
          csvContent += `${item.descriere},${item.cantitate},${item.valoare.toFixed(2)},${tva.toFixed(2)},${total.toFixed(2)}\n`;
        });
        break;
    }

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `raport_${selectedReport}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderReportContent = () => {
    if (!reportData) return null;

    switch (selectedReport) {
      case 'sumar-lunar':
      case 'raport-anual':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <FileText className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Număr Facturi</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.totalDocuments}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.subtotal.toFixed(2)} RON</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <Percent className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">TVA</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.tva.toFixed(2)} RON</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{reportData.total.toFixed(2)} RON</p>
            </div>
          </div>
        );

      case 'facturi-neincasate':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Număr Factură
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Scadentă
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Zile Întârziere
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.unpaidInvoices.map((invoice, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.numar}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {invoice.client}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {invoice.total.toFixed(2)} RON
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {new Date(invoice.dataScadenta).toLocaleDateString('ro-RO')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`px-2 py-1 rounded-full ${
                        invoice.zileIntarziere > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {invoice.zileIntarziere > 0 ? `${invoice.zileIntarziere} zile` : 'La termen'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'raport-clienti':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Număr Facturi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TVA
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(reportData.clients)
                  .sort(([, a], [, b]) => b.total - a.total)
                  .map(([client, data], index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {client}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {data.numarFacturi}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {data.subtotal.toFixed(2)} RON
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {data.tva.toFixed(2)} RON
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        {data.total.toFixed(2)} RON
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        );

      case 'raport-produse':
        return (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produs/Serviciu
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantitate
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valoare
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TVA
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total cu TVA
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.items
                  .sort((a, b) => b.valoare - a.valoare)
                  .map((item, index) => {
                    const tva = item.valoare * 0.19;
                    const total = item.valoare + tva;
                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.descriere}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.cantitate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {item.valoare.toFixed(2)} RON
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {tva.toFixed(2)} RON
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {total.toFixed(2)} RON
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        );

      case 'raport-tva':
        return (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-xl p-6">
                <FileText className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Număr Facturi</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.totalDocuments}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">Bază Impozabilă</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.subtotal.toFixed(2)} RON</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <Percent className="w-8 h-8 text-blue-600 mb-2" />
                <p className="text-sm text-gray-600">TVA Total Colectat</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.tva.toFixed(2)} RON</p>
              </div>
            </div>

            {/* Detailed Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Număr Factură
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data Facturii
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bază Impozabilă
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      TVA (19%)
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Factură
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.documents.map((doc, index) => {
                    const docData = doc.document_data;
                    let documentSubtotal = 0;
                    let documentTva = 0;
                    let documentTotal = 0;

                    // Calculate totals from items
                    if (docData.items && Array.isArray(docData.items)) {
                      docData.items.forEach(item => {
                        const itemTotal = parseFloat(item.cantitate) * parseFloat(item.pret_unitar);
                        documentSubtotal += itemTotal;
                      });
                      documentTva = documentSubtotal * 0.19;
                      documentTotal = documentSubtotal + documentTva;
                    }

                    return (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {docData.serie_numar}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(docData.data_factura).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {documentSubtotal.toFixed(2)} RON
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {documentTva.toFixed(2)} RON
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {documentTotal.toFixed(2)} RON
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {reportData.subtotal.toFixed(2)} RON
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {reportData.tva.toFixed(2)} RON
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      {reportData.total.toFixed(2)} RON
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Rapoarte</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tip Raport
              </label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {reports.map(report => (
                  <option key={report.id} value={report.id}>
                    {report.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedReport === 'raport-anual' ? 'An' : 'Perioada Raport'}
              </label>
              <div className="relative">
                <DatePicker
                  selected={startDate}
                  onChange={(dates) => {
                    if (selectedReport === 'raport-anual') {
                      setStartDate(dates);
                      setEndDate(null);
                    } else {
                      const [start, end] = dates;
                      setStartDate(start);
                      setEndDate(end);
                    }
                  }}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange={selectedReport !== 'raport-anual'}
                  showMonthYearPicker={selectedReport === 'raport-anual'}
                  dateFormat={selectedReport === 'raport-anual' ? "yyyy" : "dd/MM/yyyy"}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  calendarClassName="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg !font-sans"
                />
                <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Se generează raportul...</p>
            </div>
          ) : reportData ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">
                  {reports.find(r => r.id === selectedReport)?.name}
                </h2>
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Descarcă CSV
                </button>
              </div>

              {renderReportContent()}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">Nu există date pentru perioada selectată</p>
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ReportsPage;