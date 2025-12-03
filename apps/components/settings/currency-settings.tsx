'use client';

import { useState } from 'react';
import { useSettings, useCurrencies, useCreateCurrency, useUpdateCurrency, usePatchSettings } from '@/lib/hooks';
import { formatCurrency } from '@/lib/utils';
import { Currency } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/apps/components/ui/card';
import { Button } from '@/apps/components/ui/button';
import { Input } from '@/apps/components/ui/input';
import { Label } from '@/apps/components/ui/label';
import { Badge } from '@/apps/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/apps/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/apps/components/ui/table';
import { Check, Plus, RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function CurrencySettings() {
  const { data: settings, isLoading } = useSettings();
  const { data: currencies = [] } = useCurrencies();
  const createCurrency = useCreateCurrency();
  const updateCurrency = useUpdateCurrency();
  const patchSettings = usePatchSettings();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newSymbol, setNewSymbol] = useState('');
  const [newRate, setNewRate] = useState('');

  const [editingRate, setEditingRate] = useState<{ code: string; rate: string } | null>(null);

  const handleAddCurrency = () => {
    if (!newCode || !newName || !newSymbol || !newRate) {
      toast.error('Please fill in all fields');
      return;
    }

    if (currencies.find((c) => c.code === newCode.toUpperCase())) {
      toast.error('Currency already exists');
      return;
    }

    createCurrency.mutate({
      code: newCode.toUpperCase(),
      name: newName,
      symbol: newSymbol,
      rate: parseFloat(newRate),
    }, {
      onSuccess: () => {
        toast.success('Currency added');
        setIsDialogOpen(false);
        setNewCode('');
        setNewName('');
        setNewSymbol('');
        setNewRate('');
      },
    });
  };

  const handleUpdateRate = (code: string) => {
    if (!editingRate || !editingRate.rate) return;

    updateCurrency.mutate({
      code,
      data: { rate: parseFloat(editingRate.rate) },
    }, {
      onSuccess: () => {
        toast.success(`${code} rate updated`);
        setEditingRate(null);
      },
    });
  };

  const handleSetDefault = (code: string) => {
    patchSettings.mutate({ defaultCurrency: code }, {
      onSuccess: () => toast.success(`${code} set as default currency`),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Currency Settings</CardTitle>
            <CardDescription>
              Manage your currencies and exchange rates
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Currency
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Currency</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Currency Code</Label>
                    <Input
                      id="code"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                      placeholder="e.g., EUR"
                      maxLength={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="symbol">Symbol</Label>
                    <Input
                      id="symbol"
                      value={newSymbol}
                      onChange={(e) => setNewSymbol(e.target.value)}
                      placeholder="e.g., €"
                      maxLength={3}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Currency Name</Label>
                  <Input
                    id="name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Euro"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rate">Exchange Rate (to USD)</Label>
                  <Input
                    id="rate"
                    type="number"
                    step="0.0001"
                    min="0"
                    value={newRate}
                    onChange={(e) => setNewRate(e.target.value)}
                    placeholder="e.g., 0.92"
                  />
                  <p className="text-xs text-muted-foreground">
                    How much 1 USD equals in this currency
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCurrency}>Add Currency</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Currency</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Rate (to USD)</TableHead>
                  <TableHead>Example</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency.code}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{currency.code}</span>
                        {currency.code === settings?.defaultCurrency && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {currency.name}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono">{currency.symbol}</TableCell>
                    <TableCell>
                      {editingRate?.code === currency.code ? (
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            step="0.0001"
                            className="w-24 h-8"
                            value={editingRate.rate}
                            onChange={(e) =>
                              setEditingRate({ ...editingRate, rate: e.target.value })
                            }
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleUpdateRate(currency.code)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <span
                          className="cursor-pointer hover:text-primary"
                          onClick={() =>
                            setEditingRate({
                              code: currency.code,
                              rate: currency.rate.toString(),
                            })
                          }
                        >
                          {currency.rate.toFixed(4)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatCurrency(100, currency.code)}
                    </TableCell>
                    <TableCell className="text-right">
                      {currency.code !== settings?.defaultCurrency && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(currency.code)}
                        >
                          Set Default
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Currency Conversion</CardTitle>
          <CardDescription>
            Convert amounts between currencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyConverter currencies={currencies} />
        </CardContent>
      </Card>
    </div>
  );
}

function CurrencyConverter({ currencies }: { currencies: Currency[] }) {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');

  const fromRate = currencies.find((c) => c.code === fromCurrency)?.rate || 1;
  const toRate = currencies.find((c) => c.code === toCurrency)?.rate || 1;

  const convertedAmount = (parseFloat(amount) / fromRate) * toRate;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1 space-y-2">
        <Label>Amount</Label>
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
        />
      </div>
      <div className="flex-1 space-y-2">
        <Label>From</Label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          setFromCurrency(toCurrency);
          setToCurrency(fromCurrency);
        }}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
      <div className="flex-1 space-y-2">
        <Label>To</Label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
        >
          {currencies.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} - {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 space-y-2">
        <Label>Result</Label>
        <div className="h-10 flex items-center px-3 rounded-md border bg-muted font-medium">
          {formatCurrency(convertedAmount || 0, toCurrency)}
        </div>
      </div>
    </div>
  );
}
