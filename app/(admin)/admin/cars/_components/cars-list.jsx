"use client";
import { deleteCar, getCars, updateCarStatus } from "@/actions/cars";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useFetch from "@/hooks/use-fetch";
import { Loader2, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CarsList = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const {
    loading: loadingCars,
    fn: fetchCars,
    data: carsData,
    error: carsError,
  } = useFetch(getCars);

  useEffect(() => {
    fetchCars(search);
  }, [search]);

  const {
    loading: deletingCar,
    fn: deleteCarFn,
    data: deleteResult,
    error: deleteError,
  } = useFetch(deleteCar);

  const {
    loading: updatingCar,
    fn: updateCarStatusFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateCarStatus);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Button
          onClick={() => router.push("/admin/cars/create")}
          className="flex items-center"
        >
          <Plus className="h-4 w-4" /> Add Cars
        </Button>
        <form
          action=""
          onSubmit={handleSearchSubmit}
          className="w-full flex sm:w-auto"
        >
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 " />
            <Input
              type="search"
              placeholder="Search Cars ..."
              className=" pl-9 w-full sm:w-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </form>
      </div>
      {/* Cars Table */}
      <Card>
        <CardContent className="p-0">
          {loadingCars && !carsData ? (
            <div className="py-12 flex items-center justify-center">
              <Loader2 className=" h-8 w-8 text-gray-400 animate-spin" />
            </div>
          ) : carsData?.success && carsData.data.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right">$250.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div></div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CarsList;
