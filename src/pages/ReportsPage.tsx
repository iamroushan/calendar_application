import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CommunicationFrequencyChart } from "@/components/reports/CommunicationFrequencyChart";
import { EngagementEffectivenessChart } from "@/components/reports/EngagementEffectivenessChart";
import { OverdueTrendsChart } from "@/components/reports/OverdueTrendsChart";
import { ActivityLog } from "@/components/reports/ActivityLog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { saveAs } from "file-saver";
import { useToast } from "@/components/ui/use-toast";
import { activityData } from "@/data/activityData";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ReportsPage = () => {
  const [company, setCompany] = useState("All");
  const [communication, setCommunication] = useState("All");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text("Communication Reports", 15, 15);
    
    doc.setFontSize(12);
    doc.text(`Company: ${company}`, 15, 25);
    doc.text(`Date Range: ${startDate ? format(startDate, "dd/MM/yyyy") : ''} - ${endDate ? format(endDate, "dd/MM/yyyy") : ''}`, 15, 35);
    
    autoTable(doc, {
      head: [["Timestamp", "User", "Action", "Company", "Details"]],
      body: activityData.map(item => [
        item.timestamp,
        item.user,
        item.action,
        item.company,
        item.details
      ]),
      startY: 45
    });
    
    doc.save("communication-report.pdf");
    
    toast({
      title: "Success",
      description: "PDF report has been downloaded successfully",
    });
  };

  const exportToCSV = () => {
    const csvData = [
      ["Timestamp", "User", "Action", "Company", "Details"],
      ...activityData.map(item => [
        item.timestamp,
        item.user,
        item.action,
        item.company,
        item.details
      ])
    ];
    
    const csvString = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
    saveAs(blob, "communication-report.csv");
    
    toast({
      title: "Success",
      description: "CSV report has been downloaded successfully",
    });
  };

  const handleFilter = () => {
    // Filter logic will be implemented here
    console.log("Filtering with:", { company, communication, startDate, endDate });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold">Reports & Analytics</h1>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <Button 
              variant="outline" 
              className="w-full md:w-auto flex items-center justify-center"
              onClick={exportToCSV}
            >
              Export CSV
            </Button>
            <Button 
              variant="outline" 
              className="w-full md:w-auto flex items-center justify-center"
              onClick={exportToPDF}
            >
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <Select value={company} onValueChange={setCompany}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Company</SelectItem>
              <SelectItem value="ENTNT">ENTNT</SelectItem>
              <SelectItem value="GOOGLE">GOOGLE</SelectItem>
              <SelectItem value="MICROSOFT">MICROSOFT</SelectItem>
            </SelectContent>
          </Select>

          <Select value={communication} onValueChange={setCommunication}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Communication" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">Communication</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
              <SelectItem value="Phone">Phone Call</SelectItem>
              <SelectItem value="LinkedIn">LinkedIn Message</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 w-full">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-[200px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "dd-MM-yyyy") : <span>From date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full md:w-[200px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "dd-MM-yyyy") : <span>To date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Button className="w-full md:w-auto" onClick={handleFilter}>
              FILTER
            </Button>
          </div>
        </div>

        {/* Tabs for different reports */}
        <div className="overflow-x-auto">
          <Tabs defaultValue="frequency" className="w-full">
            <TabsList className="w-full md:w-auto flex flex-wrap">
              <TabsTrigger value="frequency" className="flex-1 md:flex-none">
                COMMUNICATION FREQUENCY
              </TabsTrigger>
              <TabsTrigger value="effectiveness" className="flex-1 md:flex-none">
                ENGAGEMENT EFFECTIVENESS
              </TabsTrigger>
              <TabsTrigger value="overdue" className="flex-1 md:flex-none">
                OVERDUE TRENDS
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex-1 md:flex-none">
                ACTIVITY LOG
              </TabsTrigger>
            </TabsList>

            <TabsContent value="frequency">
              <div className="w-full overflow-x-auto">
                <CommunicationFrequencyChart />
              </div>
            </TabsContent>

            <TabsContent value="effectiveness">
              <div className="w-full overflow-x-auto">
                <EngagementEffectivenessChart />
              </div>
            </TabsContent>

            <TabsContent value="overdue">
              <div className="w-full overflow-x-auto">
                <OverdueTrendsChart />
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="w-full overflow-x-auto">
                <ActivityLog />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;