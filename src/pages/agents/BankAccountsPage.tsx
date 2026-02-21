import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Landmark, Pencil, Shield, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { baseURL } from "@/utils/constant/url";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const BankAccountsPage = () => {
  const [agent, setAgent] = useState<any>({});
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  const token = sessionStorage.getItem("token");
  const userId = sessionStorage.getItem("userId");

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await axios.delete(`${baseURL}bank-accounts/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Bank account deleted successfully");

      setOpenDialog(false);
      setDeleteId(null);
      fetchBankAccounts();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  const fetchAgent = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}agents/byUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAgent(response.data);
    } catch (error) {
      console.error("Error fetching Agent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}bank-accounts/byAgent/${agent?.agentId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setAccounts(response.data);
    } catch (error) {
      console.error("Error fetching Accounts:", error);
    } finally {
      setIsLoading(false); // 🔥 Always stop loader
    }
  };

  useEffect(() => {
    if (userId) {
      fetchAgent();
    }
  }, [userId]);

  useEffect(() => {
    if (agent?.agentId) {
      formik.setFieldValue("agentId", agent.agentId);
      fetchBankAccounts();
    }
  }, [agent]);

  // ---------------- STATIC TABLE DATA ----------------

  const bankAccountsData = [
    {
      id: 1,
      accountHolderName: "Faiz Ahmed",
      accountNumber: "123456789012",
      bankName: "HDFC Bank",
      ifscCode: "HDFC0001234",
      branchName: "Mumbai Main",
      accountType: "Savings",
      isActive: true,
    },
    {
      id: 2,
      accountHolderName: "Ali Khan",
      accountNumber: "987654321098",
      bankName: "ICICI Bank",
      ifscCode: "ICIC0005678",
      branchName: "Delhi Branch",
      accountType: "Current",
      isActive: false,
    },
  ];

  // ---------------- VALIDATION ----------------

  const validationSchema = Yup.object({
    accountHolderName: Yup.string()
      .min(2, "Minimum 2 characters required")
      .required("Account holder name is required"),

    accountNumber: Yup.string()
      .matches(/^[0-9]{9,18}$/, "Invalid account number")
      .required("Account number is required"),

    bankName: Yup.string().required("Bank name is required"),

    ifscCode: Yup.string()
      // .matches(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code")
      .required("IFSC Code is required"),

    branchName: Yup.string().required("Branch name is required"),

    accountType: Yup.string().required("Account type is required"),
  });

  // ---------------- FORMIK ----------------

  const formik = useFormik({
    initialValues: {
      agentId: "",
      accountHolderName: "",
      accountNumber: "",
      bankName: "",
      ifscCode: "",
      branchName: "",
      accountType: "",
      isActive: false,
    },
    enableReinitialize: true,

    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!values.agentId) {
        toast.error("Agent not loaded yet");
        return;
      }

      try {
        if (editId) {
          // ✅ UPDATE
          await axios.put(`${baseURL}bank-accounts/${editId}`, values, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          toast.success("Bank account updated successfully");
        } else {
          // ✅ ADD
          await axios.post(`${baseURL}bank-accounts`, values, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          toast.success("Bank account added successfully");
        }

        resetForm();
        setEditId(null);
        fetchBankAccounts(); // refresh table
      } catch (error: any) {
        toast.error(
          error?.response?.data?.errorMessage ||
            error?.response?.data?.message ||
            "Operation failed",
        );
      }
    },
  });

  const handleEdit = (account: any) => {
    setEditId(account.accountId); // important

    formik.setValues({
      agentId: agent.agentId,
      accountHolderName: account.accountHolderName,
      accountNumber: account.accountNumber,
      bankName: account.bankName,
      ifscCode: account.ifscCode,
      branchName: account.branchName,
      accountType: account.accountType,
      isActive: account.isActive,
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- UI ----------------

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">
              Manage Bank Account
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Add your bank account details securely
            </p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-700" />
                    Bank Account Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Account Holder Name */}
                    <div className="space-y-2">
                      <Label>
                        Account Holder Name{" "}
                        <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        placeholder="Enter account holder name"
                        {...formik.getFieldProps("accountHolderName")}
                      />
                      {formik.touched.accountHolderName &&
                        formik.errors.accountHolderName && (
                          <p className="text-red-600 text-sm">
                            {formik.errors.accountHolderName}
                          </p>
                        )}
                    </div>

                    {/* Account Number */}
                    <div className="space-y-2">
                      <Label>
                        Account Number <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        placeholder="Enter account number"
                        {...formik.getFieldProps("accountNumber")}
                      />
                      {formik.touched.accountNumber &&
                        formik.errors.accountNumber && (
                          <p className="text-red-600 text-sm">
                            {formik.errors.accountNumber}
                          </p>
                        )}
                    </div>

                    {/* Bank Name */}
                    <div className="space-y-2">
                      <Label>
                        Bank Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        placeholder="Enter bank name"
                        {...formik.getFieldProps("bankName")}
                      />
                      {formik.touched.bankName && formik.errors.bankName && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.bankName}
                        </p>
                      )}
                    </div>

                    {/* IFSC Code */}
                    <div className="space-y-2">
                      <Label>
                        IFSC Code <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        placeholder="Enter IFSC code"
                        {...formik.getFieldProps("ifscCode")}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "ifscCode",
                            e.target.value.toUpperCase(),
                          )
                        }
                      />
                      {formik.touched.ifscCode && formik.errors.ifscCode && (
                        <p className="text-red-600 text-sm">
                          {formik.errors.ifscCode}
                        </p>
                      )}
                    </div>

                    {/* Branch Name */}
                    <div className="space-y-2">
                      <Label>
                        Branch Name <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        placeholder="Enter branch name"
                        {...formik.getFieldProps("branchName")}
                      />
                      {formik.touched.branchName &&
                        formik.errors.branchName && (
                          <p className="text-red-600 text-sm">
                            {formik.errors.branchName}
                          </p>
                        )}
                    </div>

                    {/* Account Type */}
                    <div className="space-y-2">
                      <Label>
                        Account Type <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        placeholder="Savings / Current"
                        {...formik.getFieldProps("accountType")}
                      />
                      {formik.touched.accountType &&
                        formik.errors.accountType && (
                          <p className="text-red-600 text-sm">
                            {formik.errors.accountType}
                          </p>
                        )}
                    </div>
                    {/* Is Active Checkbox */}
                    <div className="col-span-1 md:col-span-2">
                      <div className="flex items-center space-x-2 mt-2">
                        <Checkbox
                          id="isActive"
                          checked={formik.values.isActive}
                          onCheckedChange={(checked) =>
                            formik.setFieldValue("isActive", checked)
                          }
                        />
                        <Label htmlFor="isActive" className="cursor-pointer">
                          Active Account
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      className={`w-48 ${editId ? "bg-secondary hover:bg-secondary/90" : ""}`}
                    >
                      {editId ? "Update Account" : "Add Account"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
          {/* ---------------- BANK ACCOUNTS TABLE ---------------- */}

          <Card className="mt-8">
            <CardContent>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Landmark className="h-5 w-5 text-primary" />
                Bank Accounts List
              </h3>

              {accounts && accounts.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border text-sm">
                    <thead className="bg-muted">
                      <tr className="text-left">
                        <th className="p-3 border">Account Holder</th>
                        <th className="p-3 border">Account Number</th>
                        <th className="p-3 border">Bank Name</th>
                        <th className="p-3 border">IFSC</th>
                        <th className="p-3 border">Branch</th>
                        <th className="p-3 border">Type</th>
                        <th className="p-3 border text-center">Active</th>
                        <th className="p-3 border text-center">Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {accounts.map((account: any) => (
                        <tr
                          key={account.accountId}
                          className="hover:bg-muted/50"
                        >
                          <td className="p-2 border">
                            {account.accountHolderName}
                          </td>
                          <td className="p-2 border">
                            {account.accountNumber}
                          </td>
                          <td className="p-2 border">{account.bankName}</td>
                          <td className="p-2 border">{account.ifscCode}</td>
                          <td className="p-2 border">{account.branchName}</td>
                          <td className="p-2 border">{account.accountType}</td>

                          <td className="p-2 border text-center">
                            {account.isActive ? (
                              <Badge className="bg-green-100 text-green-700">
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="destructive">Inactive</Badge>
                            )}
                          </td>

                          <td className="p-2 border text-center">
                            <div className="flex justify-center gap-3">
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8"
                                onClick={() => handleEdit(account)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              <Button
                                size="icon"
                                variant="destructive"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleDeleteClick(account.accountId)
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* 🔥 Professional Empty State */
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Landmark className="h-12 w-12 text-muted-foreground mb-4" />

                  <h4 className="text-lg font-semibold mb-2">
                    No Bank Accounts Found
                  </h4>

                  <p className="text-muted-foreground max-w-md">
                    You haven't added any bank accounts yet. Please add a bank
                    account to see it listed here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* delete dialog box */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Bank Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bank account? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>

            <Button variant="destructive" onClick={confirmDelete}>
              Yes, Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BankAccountsPage;
