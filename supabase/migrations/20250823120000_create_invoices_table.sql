-- Create invoices table
create table if not exists public.invoices (
  id bigint generated always as identity primary key,
  invoice_number text not null unique,
  student_id bigint references public.students(id) on delete set null,
  created_by text,
  status text not null default 'Unpaid', -- Paid, Unpaid, Due
  invoice_date date,
  due_date date,
  subtotal numeric(12,2) default 0,
  discount_amount numeric(12,2) default 0,
  gst_amount numeric(12,2) default 0,
  total_amount numeric(12,2) default 0,
  items jsonb, -- array of invoice items
  terms text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists invoices_student_id_idx on public.invoices(student_id);
create index if not exists invoices_invoice_date_idx on public.invoices(invoice_date);
create index if not exists invoices_status_idx on public.invoices(status);

-- trigger to update updated_at
create or replace function public.trigger_set_timestamp()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger invoices_set_timestamp
before update on public.invoices
for each row
execute procedure public.trigger_set_timestamp();
