import { useState } from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CommunicationMethod {
  id: string;
  name: string;
  description: string;
  sequence: number;
  mandatory: boolean;
}

const CommunicationMethods = () => {
  const [methods, setMethods] = useState<CommunicationMethod[]>([
    {
      id: "1",
      name: "LinkedIn Post",
      description: "Share or interact with company posts on LinkedIn",
      sequence: 1,
      mandatory: true
    },
    {
      id: "2",
      name: "LinkedIn Message",
      description: "launch the grand iphone 16",
      sequence: 2,
      mandatory: true
    },
    {
      id: "3",
      name: "Email",
      description: "cancelled freshers hiring",
      sequence: 3,
      mandatory: true
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState<CommunicationMethod | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
      sequence: 1,
      mandatory: true
    }
  });

  const onSubmit = (data: any) => {
    if (editingMethod) {
      // Edit existing method
      setMethods(methods.map(method => 
        method.id === editingMethod.id 
          ? { ...data, id: editingMethod.id }
          : method
      ));
      toast.success("Method updated successfully");
    } else {
      // Add new method
      const newMethod = {
        id: Date.now().toString(),
        ...data
      };
      setMethods([...methods, newMethod]);
      toast.success("Method added successfully");
    }
    form.reset();
    setIsOpen(false);
    setEditingMethod(null);
  };

  const handleEdit = (method: CommunicationMethod) => {
    setEditingMethod(method);
    form.reset(method);
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    setMethods(methods.filter(method => method.id !== id));
    toast.success("Method deleted successfully");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Communication Methods</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setEditingMethod(null);
                form.reset({
                  name: "",
                  description: "",
                  sequence: methods.length + 1,
                  mandatory: true
                });
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Method
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingMethod ? "Edit Method" : "Add New Method"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Method Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter method name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter description" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sequence"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sequence</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          {...field} 
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mandatory"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox 
                          checked={field.value} 
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Mandatory</FormLabel>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  {editingMethod ? "Update Method" : "Add Method"}
                </Button>
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
              <TableHead>Description</TableHead>
              <TableHead>Sequence</TableHead>
              <TableHead>Mandatory</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.map((method) => (
              <TableRow key={method.id}>
                <TableCell>{method.name}</TableCell>
                <TableCell>{method.description}</TableCell>
                <TableCell>{method.sequence}</TableCell>
                <TableCell>{method.mandatory ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => handleEdit(method)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDelete(method.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CommunicationMethods;