
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit } from "lucide-react";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/DataTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Sample hostel data
const hostelData = [
  {
    id: "1",
    name: "Central Student Hostel",
    location: "Tashkent, Uzbekistan",
    capacity: 120,
    occupancy: 98,
    monthlyRent: "$250",
    contactPerson: "Mr. Aziz Karimov",
    phone: "+998 71 123 4567"
  },
  {
    id: "2",
    name: "Medical University Accommodation",
    location: "Samarkand, Uzbekistan",
    capacity: 80,
    occupancy: 75,
    monthlyRent: "$220",
    contactPerson: "Mrs. Dilnoza Aliyeva",
    phone: "+998 66 234 5678"
  },
  {
    id: "3",
    name: "International Student Residence",
    location: "Bukhara, Uzbekistan",
    capacity: 60,
    occupancy: 52,
    monthlyRent: "$200",
    contactPerson: "Mr. Ravshan Umarov",
    phone: "+998 65 223 4455"
  }
];

const HostelManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredData = hostelData.filter(
    (hostel) => hostel.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    { header: "Hostel Name", accessorKey: "name" },
    { header: "Location", accessorKey: "location" },
    { header: "Capacity", accessorKey: "capacity" },
    { header: "Occupancy", accessorKey: "occupancy" },
    { header: "Monthly Rent", accessorKey: "monthlyRent" },
    { header: "Contact Person", accessorKey: "contactPerson" },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: (row: any) => (
        <Button variant="outline" size="sm">
          <Edit className="mr-2 h-4 w-4" />
          Manage
        </Button>
      ),
    },
  ];
  
  return (
    <MainLayout>
      <PageHeader
        title="Hostel Management"
        description="Manage student accommodations and hostel facilities"
        actions={
          <Button variant="default" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Hostel
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Hostels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hostelData.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Capacity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hostelData.reduce((sum, hostel) => sum + hostel.capacity, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Occupancy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hostelData.reduce((sum, hostel) => sum + hostel.occupancy, 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((hostelData.reduce((sum, hostel) => sum + hostel.occupancy, 0) / 
                hostelData.reduce((sum, hostel) => sum + hostel.capacity, 0)) * 100)}% occupied
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-6">
        <Input
          placeholder="Search hostels..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          prefix={<Search className="h-4 w-4 text-muted-foreground" />}
        />
      </div>
      
      <div className="rounded-lg border bg-card shadow-sm">
        <DataTable columns={columns} data={filteredData} />
      </div>
    </MainLayout>
  );
};

export default HostelManagement;
