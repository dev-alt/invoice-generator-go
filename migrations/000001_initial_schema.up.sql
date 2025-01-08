-- migrations/000001_initial_schema.up.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users (
                                     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                     email VARCHAR(255) UNIQUE NOT NULL,
                                     password_hash VARCHAR(255) NOT NULL,
                                     company_name VARCHAR(255),
                                     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS templates (
                                         id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                         user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                         name VARCHAR(255) NOT NULL,
                                         language VARCHAR(50),
                                         background_url TEXT,
                                         logo_url TEXT,
                                         content TEXT NOT NULL,
                                         created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                         updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS invoices (
                                        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                                        template_id UUID REFERENCES templates(id) ON DELETE SET NULL,
                                        invoice_number VARCHAR(50) NOT NULL,
                                        status VARCHAR(20) NOT NULL DEFAULT 'draft'
                                            CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'void')),
                                        customer_name VARCHAR(255) NOT NULL,
                                        customer_email VARCHAR(255),
                                        customer_address TEXT,
                                        invoice_date TIMESTAMP WITH TIME ZONE NOT NULL,
                                        due_date TIMESTAMP WITH TIME ZONE NOT NULL,
                                        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
                                        subtotal DECIMAL(15,2) NOT NULL CHECK (subtotal >= 0),
                                        tax_rate DECIMAL(5,2) CHECK (tax_rate >= 0 AND tax_rate <= 100),
                                        tax_amount DECIMAL(15,2) CHECK (tax_amount >= 0),
                                        total_amount DECIMAL(15,2) NOT NULL CHECK (total_amount >= 0),
                                        notes TEXT,
                                        pdf_path TEXT,
                                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                        CONSTRAINT invoice_dates_check CHECK (due_date >= invoice_date),
                                        UNIQUE(user_id, invoice_number)
);

CREATE TABLE IF NOT EXISTS invoice_items (
                                             id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                                             invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
                                             description TEXT NOT NULL,
                                             quantity DECIMAL(15,2) NOT NULL CHECK (quantity > 0),
                                             unit_price DECIMAL(15,2) NOT NULL CHECK (unit_price >= 0),
                                             total_price DECIMAL(15,2) NOT NULL CHECK (total_price >= 0),
                                             created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                                             updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_template_id ON invoices(template_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_number_user ON invoices(user_id, invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at
    BEFORE UPDATE ON templates
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoice_items_updated_at
    BEFORE UPDATE ON invoice_items
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create invoice summary view
CREATE OR REPLACE VIEW invoice_summary AS
SELECT
    i.id,
    i.invoice_number,
    i.status,
    i.customer_name,
    i.total_amount,
    i.due_date,
    COUNT(ii.id) as item_count,
    u.company_name as company_name,
    i.created_at,
    i.updated_at
FROM invoices i
         LEFT JOIN invoice_items ii ON i.id = ii.invoice_id
         LEFT JOIN users u ON i.user_id = u.id
GROUP BY i.id, u.company_name;