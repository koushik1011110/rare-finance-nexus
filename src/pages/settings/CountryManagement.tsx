import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Globe } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { fetchAllCountries, createCountry, updateCountry, deleteCountry, Country } from "@/lib/countries-api";

const CountryManagement = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      setLoading(true);
      const data = await fetchAllCountries();
      setCountries(data);
    } catch (error) {
      console.error('Error loading countries:', error);
      toast({
        title: "Error",
        description: "Failed to load countries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Country name is required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingCountry) {
        await updateCountry(editingCountry.id, formData);
        toast({
          title: "Success",
          description: "Country updated successfully!",
        });
      } else {
        await createCountry(formData);
        toast({
          title: "Success", 
          description: "Country added successfully!",
        });
      }
      
      setDialogOpen(false);
      setEditingCountry(null);
      setFormData({ name: "", code: "" });
      loadCountries();
    } catch (error) {
      console.error('Error saving country:', error);
      toast({
        title: "Error",
        description: "Failed to save country.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (country: Country) => {
    setEditingCountry(country);
    setFormData({
      name: country.name,
      code: country.code || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this country?")) {
      return;
    }

    try {
      await deleteCountry(id);
      toast({
        title: "Success",
        description: "Country deleted successfully!",
      });
      loadCountries();
    } catch (error) {
      console.error('Error deleting country:', error);
      toast({
        title: "Error",
        description: "Failed to delete country.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (country: Country) => {
    try {
      await updateCountry(country.id, { is_active: !country.is_active });
      toast({
        title: "Success",
        description: `Country ${country.is_active ? 'deactivated' : 'activated'} successfully!`,
      });
      loadCountries();
    } catch (error) {
      console.error('Error updating country status:', error);
      toast({
        title: "Error",
        description: "Failed to update country status.",
        variant: "destructive",
      });
    }
  };

  const openAddDialog = () => {
    setEditingCountry(null);
    setFormData({ name: "", code: "" });
    setDialogOpen(true);
  };

  if (loading) {
    return <div className="p-6">Loading countries...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <Globe className="mr-2 h-6 w-6" />
            Country Management
          </h2>
          <p className="text-muted-foreground">Manage countries available for student selection</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Add Country
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCountry ? "Edit Country" : "Add New Country"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Country Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter country name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Country Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                  placeholder="Enter country code (e.g., IN, US)"
                  maxLength={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCountry ? "Update" : "Add"} Country
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Countries List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {countries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell className="font-medium">{country.name}</TableCell>
                  <TableCell>{country.code || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(country)}
                    >
                      <Badge variant={country.is_active ? "default" : "secondary"}>
                        {country.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </Button>
                  </TableCell>
                  <TableCell>
                    {new Date(country.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(country)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(country.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {countries.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No countries found. Add your first country to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CountryManagement;