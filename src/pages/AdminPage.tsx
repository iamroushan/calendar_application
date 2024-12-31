import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Edit, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CommunicationMethods from "@/components/admin/CommunicationMethods";

interface Company {
  id: string;
  name: string;
  location: string;
  communicationPeriod: number;
}

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<'companies' | 'methods'>('companies');
  const [companies, setCompanies] = useState<Company[]>([
    {
      id: "1",
      name: "ENTNT",
      location: "Abu Dhabi",
      communicationPeriod: 7
    },
    {
      id: "2",
      name: "APPLE",
      location: "California, US",
      communicationPeriod: 9
    }
  ]);

  const form = useForm({
    defaultValues: {
      name: "",
      location: "",
      communicationPeriod: 7
    }
  });

  const onSubmit = (data: any) => {
    const newCompany = {
      id: Date.now().toString(),
      ...data
    };
    setCompanies([...companies, newCompany]);
    toast.success("Company added successfully");
    form.reset();
  };

  const handleDelete = (id: string) => {
    setCompanies(companies.filter(company => company.id !== id));
    toast.success("Company deleted successfully");
  };

  return (
    <Layout>
      <div className="space-y-6 p-6">
        <div className="flex space-x-4 mb-6">
          <Button
            variant={activeTab === 'companies' ? 'default' : 'outline'}
            onClick={() => setActiveTab('companies')}
          >
            Company Management
          </Button>
          <Button
            variant={activeTab === 'methods' ? 'default' : 'outline'}
            onClick={() => setActiveTab('methods')}
          >
            Communication Methods
          </Button>
        </div>

        {activeTab === 'companies' ? (
          <>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Company Management</h1>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Company
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Company</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter company name" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter location" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="communicationPeriod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Communication Period (days)</FormLabel>
                            <FormControl>
                              <Input type="number" min="1" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full">Add Company</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="bg-white rounded-lg shadow">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Communication Period</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell>{company.name}</TableCell>
                      <TableCell>{company.location}</TableCell>
                      <TableCell>Every {company.communicationPeriod} days</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-800">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(company.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        ) : (
          <CommunicationMethods />
        )}
      </div>
    </Layout>
  );
};

export default AdminPage;
