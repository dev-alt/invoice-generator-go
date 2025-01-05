-- init.sql
-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE users (
                       id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password_hash VARCHAR(255) NOT NULL,
                       company_name VARCHAR(255),
                       created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE templates (
                           id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                           user_id UUID REFERENCES users(id),
                           name VARCHAR(255) NOT NULL,
                           language VARCHAR(50),
                           background_url TEXT,
                           logo_url TEXT,
                           content TEXT,
                           created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                           updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoices (
                          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          user_id UUID REFERENCES users(id),
                          template_id UUID REFERENCES templates(id),
                          invoice_number VARCHAR(50) NOT NULL,
                          status VARCHAR(20) NOT NULL DEFAULT 'draft',
                          customer_name VARCHAR(255) NOT NULL,
                          customer_email VARCHAR(255),
                          customer_address TEXT,
                          invoice_date DATE NOT NULL,
                          due_date DATE NOT NULL,
                          currency VARCHAR(3) NOT NULL DEFAULT 'USD',
                          subtotal DECIMAL(15,2) NOT NULL,
                          tax_rate DECIMAL(5,2),
                          tax_amount DECIMAL(15,2),
                          total_amount DECIMAL(15,2) NOT NULL,
                          notes TEXT,
                          pdf_path TEXT,
                          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
                               id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                               invoice_id UUID REFERENCES invoices(id),
                               description TEXT NOT NULL,
                               quantity DECIMAL(15,2) NOT NULL,
                               unit_price DECIMAL(15,2) NOT NULL,
                               total_price DECIMAL(15,2) NOT NULL,
                               created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_invoices_user_id ON invoices(user_id);
CREATE INDEX idx_invoices_template_id ON invoices(template_id);
CREATE INDEX idx_invoice_items_invoice_id ON invoice_items(invoice_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
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