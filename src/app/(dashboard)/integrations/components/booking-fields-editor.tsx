'use client';

import { useState } from 'react';
import { GripVertical, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import type { BookingField } from '@/types';

interface BookingFieldsEditorProps {
  fields: BookingField[];
  onFieldsChange: (fields: BookingField[]) => void;
}

const fieldTypeLabels: Record<string, string> = {
  text: 'Text',
  number: 'Number',
  date: 'Date',
  time: 'Time',
  select: 'Dropdown',
  phone: 'Phone',
  email: 'Email',
};

export function BookingFieldsEditor({ fields, onFieldsChange }: BookingFieldsEditorProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<BookingField | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newField, setNewField] = useState<Partial<BookingField>>({
    label: '',
    type: 'text',
    required: false,
  });

  const handleToggleRequired = (fieldId: string) => {
    onFieldsChange(
      fields.map((f) => (f.id === fieldId ? { ...f, required: !f.required } : f))
    );
  };

  const handleRemoveField = (fieldId: string) => {
    onFieldsChange(fields.filter((f) => f.id !== fieldId));
  };

  const handleStartEdit = (field: BookingField) => {
    setEditingId(field.id);
    setEditingField({ ...field });
  };

  const handleSaveEdit = () => {
    if (editingField) {
      onFieldsChange(
        fields.map((f) => (f.id === editingField.id ? editingField : f))
      );
      setEditingId(null);
      setEditingField(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingField(null);
  };

  const handleAddField = () => {
    if (!newField.label) return;

    const field: BookingField = {
      id: `custom_${Date.now()}`,
      label: newField.label,
      type: newField.type as BookingField['type'],
      required: newField.required || false,
      voicePrompt: newField.voicePrompt,
    };

    onFieldsChange([...fields, field]);
    setNewField({ label: '', type: 'text', required: false });
    setIsAddingNew(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <h2 className="text-lg font-bold text-slate-900">Booking Fields</h2>
        <p className="text-sm text-slate-500 mt-1">
          Configure what information to collect from callers when they make a booking.
        </p>
      </div>

      <div className="lg:col-span-2">
        <Card className="border-none shadow-md ring-1 ring-slate-200 overflow-hidden">
          <CardContent className="p-6 space-y-3">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg group"
              >
                <GripVertical className="w-4 h-4 text-slate-300 cursor-grab" />

                {editingId === field.id && editingField ? (
                  <div className="flex-1 flex items-center gap-2">
                    <Input
                      value={editingField.label}
                      onChange={(e) =>
                        setEditingField({ ...editingField, label: e.target.value })
                      }
                      className="flex-1"
                      placeholder="Field label"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex-1">
                      <span className="font-medium text-sm text-slate-900">
                        {field.label}
                      </span>
                      <span className="ml-2 text-xs text-slate-400">
                        ({fieldTypeLabels[field.type] || field.type})
                      </span>
                    </div>

                    <label className="flex items-center gap-2 text-xs text-slate-500">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={() => handleToggleRequired(field.id)}
                        className="rounded border-slate-300 text-primary focus:ring-primary"
                      />
                      Required
                    </label>

                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <button
                        onClick={() => handleStartEdit(field)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveField(field.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {isAddingNew ? (
              <div className="p-3 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                <div className="flex items-center gap-3">
                  <Input
                    value={newField.label}
                    onChange={(e) =>
                      setNewField({ ...newField, label: e.target.value })
                    }
                    placeholder="Field label (e.g., Notes)"
                    className="flex-1"
                  />
                  <select
                    value={newField.type}
                    onChange={(e) =>
                      setNewField({ ...newField, type: e.target.value as BookingField['type'] })
                    }
                    className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="phone">Phone</option>
                    <option value="email">Email</option>
                  </select>
                  <label className="flex items-center gap-2 text-xs text-slate-500">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) =>
                        setNewField({ ...newField, required: e.target.checked })
                      }
                      className="rounded border-slate-300 text-primary focus:ring-primary"
                    />
                    Required
                  </label>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button size="sm" onClick={handleAddField}>
                    Add Field
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsAddingNew(false);
                      setNewField({ label: '', type: 'text', required: false });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingNew(true)}
                className="w-full p-3 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-500 hover:border-slate-300 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Custom Field
              </button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
