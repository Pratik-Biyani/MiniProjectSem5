import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";
import { Calendar, TrendingUp, DollarSign, Users, PieChart, Plus, Edit3, Trash2, Save, AlertCircle, CheckCircle } from "lucide-react";

const StartupAddMetrics = () => {
  const { startup_id } = useParams();
  const [form, setForm] = useState({
    revenue: "",
    expenses: "",
    profit: "",
    fundingRaised: "",
    totalUsers: "",
    newUsers: "",
    churnRate: "",
    retentionRate: "",
    period: "",
  });

  const [message, setMessage] = useState("");
  const [action, setAction] = useState("add");
  const [existingPeriods, setExistingPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExistingPeriods();
  }, [startup_id]);

  const fetchExistingPeriods = async () => {
    try {
      const response = await api.get(`/analytics/startup/${startup_id}/metrics`);
      const periods = [...new Set(response.data.map(metric => metric.period))];
      setExistingPeriods(periods.sort());
    } catch (err) {
      console.error("Failed to fetch periods:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
    setMessage("");
    setForm({
      revenue: "",
      expenses: "",
      profit: "",
      fundingRaised: "",
      totalUsers: "",
      newUsers: "",
      churnRate: "",
      retentionRate: "",
      period: "",
    });
  };

  const loadMetricsForPeriod = async (period) => {
    if (!period) return;
    
    setIsLoading(true);
    try {
      const response = await api.get(`/analytics/startup/${startup_id}/metrics/${period}`);
      const metrics = response.data;
      
      setForm({
        revenue: metrics.revenue || "",
        expenses: metrics.expenses || "",
        profit: metrics.profit || "",
        fundingRaised: metrics.fundingRaised || "",
        totalUsers: metrics.totalUsers || "",
        newUsers: metrics.newUsers || "",
        churnRate: metrics.churnRate || "",
        retentionRate: metrics.retentionRate || "",
        period: metrics.period,
      });
      setMessage("Metrics loaded successfully!");
    } catch (err) {
      if (err.response?.status === 404) {
        setMessage("No metrics found for this period. You can add new metrics.");
        setForm(prev => ({ ...prev, period }));
      } else {
        setMessage("Failed to load metrics.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.period) {
      setMessage("Please enter a period.");
      return;
    }

    setIsLoading(true);
    
    try {
      const numericForm = Object.fromEntries(
        Object.entries(form).map(([key, value]) => {
          if (["period"].includes(key)) return [key, value];
          return [key, value === "" ? "" : Number(value)];
        })
      );

      if (action === "add") {
        await api.post("/analytics/startup/metrics", {
          ...numericForm,
          startupId: startup_id,
        });
        setMessage("Metrics added successfully!");
      } else if (action === "edit") {
        await api.put("/analytics/startup/metrics", {
          ...numericForm,
          startupId: startup_id,
        });
        setMessage("Metrics updated successfully!");
      }

      setForm({
        revenue: "",
        expenses: "",
        profit: "",
        fundingRaised: "",
        totalUsers: "",
        newUsers: "",
        churnRate: "",
        retentionRate: "",
        period: "",
      });
      
      fetchExistingPeriods();
      
    } catch (err) {
      console.error(err);
      setMessage(`Failed to ${action} metrics. ${err.response?.data?.message || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!form.period) {
      setMessage("Please select a period to delete.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete metrics for ${form.period}?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await api.delete(`/analytics/startup/${startup_id}/metrics/${form.period}`);
      setMessage("Metrics deleted successfully!");
      
      setForm({
        revenue: "",
        expenses: "",
        profit: "",
        fundingRaised: "",
        totalUsers: "",
        newUsers: "",
        churnRate: "",
        retentionRate: "",
        period: "",
      });
      
      fetchExistingPeriods();
    } catch (err) {
      console.error(err);
      setMessage(`Failed to delete metrics. ${err.response?.data?.message || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionConfig = () => {
    switch(action) {
      case "add":
        return {
          icon: Plus,
          color: "from-blue-500 to-indigo-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonColor: "bg-blue-600 hover:bg-blue-700"
        };
      case "edit":
        return {
          icon: Edit3,
          color: "from-amber-500 to-orange-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
          buttonColor: "bg-amber-600 hover:bg-amber-700"
        };
      case "delete":
        return {
          icon: Trash2,
          color: "from-red-500 to-rose-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
          buttonColor: "bg-red-600 hover:bg-red-700"
        };
      default:
        return {
          icon: Plus,
          color: "from-blue-500 to-indigo-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          buttonColor: "bg-blue-600 hover:bg-blue-700"
        };
    }
  };

  const config = getActionConfig();
  const ActionIcon = config.icon;

  const metricFields = [
    { name: "revenue", label: "Revenue", icon: DollarSign, color: "text-blue-600" },
    { name: "expenses", label: "Expenses", icon: TrendingUp, color: "text-red-600" },
    { name: "profit", label: "Profit", icon: PieChart, color: "text-green-600" },
    { name: "fundingRaised", label: "Funding Raised", icon: DollarSign, color: "text-purple-600" },
    { name: "totalUsers", label: "Total Users", icon: Users, color: "text-orange-600" },
    { name: "newUsers", label: "New Users", icon: Users, color: "text-cyan-600" },
    { name: "churnRate", label: "Churn Rate (%)", icon: TrendingUp, color: "text-rose-600" },
    { name: "retentionRate", label: "Retention Rate (%)", icon: TrendingUp, color: "text-emerald-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-3">
            <div className={`p-3 bg-gradient-to-r ${config.color} rounded-xl mr-4 shadow-lg`}>
              <ActionIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-1">Manage Metrics</h1>
              <p className="text-gray-600">Add, edit, or delete your startup's performance metrics</p>
            </div>
          </div>
        </div>

        {/* Action Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-3">Select Action</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "add", label: "Add New", icon: Plus, color: "blue" },
              { value: "edit", label: "Edit Existing", icon: Edit3, color: "amber" },
              { value: "delete", label: "Delete", icon: Trash2, color: "red" }
            ].map((opt) => {
              const Icon = opt.icon;
              const isActive = action === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleActionChange({ target: { value: opt.value } })}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isActive
                      ? `bg-${opt.color}-600 text-white shadow-lg`
                      : `bg-gray-100 text-gray-600 hover:bg-gray-200`
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-md ${
            message.includes("successfully") 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            {message.includes("successfully") ? (
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            )}
            <p className={`text-sm font-medium ${
              message.includes("successfully") ? "text-green-800" : "text-red-800"
            }`}>
              {message}
            </p>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {/* Period Selection */}
          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
              <Calendar className="w-4 h-4" />
              Period
            </label>
            {action === "add" ? (
              <input
                type="text"
                name="period"
                value={form.period}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                placeholder="e.g., Jan 2025"
              />
            ) : (
              <select
                name="period"
                value={form.period}
                onChange={(e) => {
                  setForm({ ...form, period: e.target.value });
                  if (action === "edit") {
                    loadMetricsForPeriod(e.target.value);
                  }
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select a period</option>
                {existingPeriods.map(period => (
                  <option key={period} value={period}>{period}</option>
                ))}
              </select>
            )}
          </div>

          {/* Metrics Fields */}
          {action !== "delete" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              {metricFields.map((field) => {
                const FieldIcon = field.icon;
                return (
                  <div key={field.name}>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      <FieldIcon className={`w-4 h-4 ${field.color}`} />
                      {field.label}
                    </label>
                    <input
                      type="number"
                      name={field.name}
                      value={form[field.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required={action === "add"}
                      step={field.name.includes("Rate") ? "0.1" : "1"}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4">
            {action !== "delete" ? (
              <button
                type="submit"
                disabled={isLoading || !form.period}
                className={`w-full ${config.buttonColor} text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    {action === "add" ? "Add Metrics" : "Update Metrics"}
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isLoading || !form.period}
                className={`w-full ${config.buttonColor} text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete Metrics
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Existing Periods */}
        {existingPeriods.length > 0 && (
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Available Periods
            </h3>
            <div className="flex flex-wrap gap-2">
              {existingPeriods.map(period => (
                <button
                  key={period}
                  onClick={() => {
                    setForm(prev => ({ ...prev, period }));
                    if (action === "edit") {
                      loadMetricsForPeriod(period);
                    }
                  }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 transition-all shadow-sm hover:shadow-md"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupAddMetrics;