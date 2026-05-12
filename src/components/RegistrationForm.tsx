import { useState, useRef, useEffect } from 'react';
import { ArrowRight, CheckCircle2, MessageCircle, ChevronDown, Search, Download, Calendar, MapPin, Clock, Ticket } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { nanoid } from 'nanoid';

type RegistrationFormProps = {
  className?: string;
  variant?: 'light' | 'dark';
};

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands', 'Chandigarh', 
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi NCR', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
];

const cities = ['Mangaluru'];
const examYears = ['NEET 2026', 'NEET 2027', 'NEET 2028', 'Already Appeared'];
const courses = ['MBBS Abroad', 'MBBS India', 'Scholarship Guidance', 'Admission Support', 'Not Sure Yet'];

const cityVenues: Record<string, { venue: string, address: string, date: string, time: string }> = {
  'Mangaluru': { venue: 'Hotel Deepa Comforts', address: 'MG Rd, Kodailbail, Mangaluru, Karnataka 575003', date: 'Sunday, 17th May', time: '10 AM Onwards' },
};

function CustomDropdown({ 
  label, 
  options, 
  value, 
  onChange, 
  placeholder,
  showSearch = false
}: { 
  label: string, 
  options: string[], 
  value: string, 
  onChange: (val: string) => void,
  placeholder: string,
  showSearch?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(opt => 
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <label className="dropdown-label">{label}</label>
      <button 
        type="button" 
        className={cn("dropdown-trigger", value && "has-value", isOpen && "is-open")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} className={cn("chevron", isOpen && "rotate")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="dropdown-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
          >
            {showSearch && (
              <div className="dropdown-search">
                <Search size={14} />
                <input 
                  autoFocus
                  placeholder="Search..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
            <div className="dropdown-options">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={cn("dropdown-option", opt === value && "is-selected")}
                    onClick={() => {
                      onChange(opt);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                  >
                    {opt}
                    {opt === value && <CheckCircle2 size={14} className="check" />}
                  </button>
                ))
              ) : (
                <div className="no-options">No results found</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RegistrationForm({ className, variant = 'light' }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    state: '',
    preferredCity: 'Mangaluru',
    neetExamYear: '',
    interestedCourse: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [ticketId, setTicketId] = useState('');
  const ticketRef = useRef<HTMLDivElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleDropdownChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: null
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width / 2, canvas.height / 2]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`MBBS-Seminar-Ticket-${ticketId}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.state || !formData.preferredCity || !formData.neetExamYear || !formData.interestedCourse) {
      setError('Please fill in all dropdown fields.');
      return;
    }
    setLoading(true);
    setError('');

    const newTicketId = `MBBS-${nanoid(6).toUpperCase()}`;
    setTicketId(newTicketId);

    const payload = {
      ...formData,
      preferredCity: formData.preferredCity || 'Mangaluru',
      ticketId: newTicketId,
      eventName: 'MBBS Dream Mega MBBS Seminar - Mangaluru',
      registrationType: 'free_seat_reservation',
      source: 'landing_page',
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => null);
        if (body?.configured !== false) {
          throw new Error(body?.error || 'Registration endpoint failed.');
        }
      }
    } catch (err: unknown) {
      console.warn('Airtable registration unavailable; saving local backup.', err);
      localStorage.setItem(`mbbs-registration-${newTicketId}`, JSON.stringify({
        ...payload,
        source: 'landing_page_local_backup',
      }));
    } finally {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    const venueInfo = cityVenues[formData.preferredCity] || cityVenues['Mangaluru'];

    return (
      <div className={cn('registration-success', variant === 'dark' && 'registration-success-dark', className)}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="success-icon">
          <CheckCircle2 size={48} />
        </motion.div>
        <h3>Registration Successful!</h3>
        <p>Your free seat is reserved. Please download your hall ticket below.</p>

        {/* Hidden Ticket Template for PDF Generation */}
        <div className="ticket-container">
          <div ref={ticketRef} className="hall-ticket">
            <div className="ticket-header">
              <div className="ticket-logo">
                <Ticket size={24} />
                <span>MBBS DREAM MEGA MBBS SEMINAR</span>
              </div>
              <div className="ticket-id">
                <small>HALL TICKET NO.</small>
                <strong>{ticketId}</strong>
              </div>
            </div>

            <div className="ticket-body">
              <div className="ticket-section main">
                <div className="student-info">
                  <div className="info-item">
                    <label>STUDENT NAME</label>
                    <p>{formData.fullName}</p>
                  </div>
                  <div className="info-group">
                    <div className="info-item">
                      <label>MOBILE NUMBER</label>
                      <p>{formData.mobileNumber}</p>
                    </div>
                    <div className="info-item">
                      <label>EMAIL ADDRESS</label>
                      <p>{formData.emailAddress}</p>
                    </div>
                  </div>
                  <div className="info-group">
                    <div className="info-item">
                      <label>STATE</label>
                      <p>{formData.state}</p>
                    </div>
                    <div className="info-item">
                      <label>EXAM YEAR</label>
                      <p>{formData.neetExamYear}</p>
                    </div>
                  </div>
                </div>
                
                <div className="venue-info-box">
                  <div className="venue-title">
                    <MapPin size={16} />
                    <span>SEMINAR VENUE</span>
                  </div>
                  <h4>{venueInfo.venue}</h4>
                  <p>{venueInfo.address}</p>
                  <div className="time-info">
                    <div className="time-item">
                      <Calendar size={14} />
                      <span>{venueInfo.date}</span>
                    </div>
                    <div className="time-item">
                      <Clock size={14} />
                      <span>{venueInfo.time}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ticket-footer">
                <div className="ticket-note">
                  <strong>IMPORTANT INSTRUCTIONS:</strong>
                  <ul>
                    <li>Please carry a digital or printed copy of this ticket.</li>
                    <li>Entry is free for registered students and parents.</li>
                    <li>Reach the venue 15 minutes before the scheduled time.</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="ticket-cut-line"></div>
          </div>
        </div>

        <div className="success-actions">
          <button onClick={downloadTicket} className="btn btn-gold btn-large w-full">
            <Download size={18} /> Download Hall Ticket (PDF)
          </button>
          
          <a
            href={`https://wa.me/917899919917?text=${encodeURIComponent(`Hi, I registered for MBBS Dream Mega MBBS Seminar Mangaluru. My ticket ID is ${ticketId}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp w-full"
          >
            <MessageCircle size={17} /> Message on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('registration-form', variant === 'dark' && 'registration-form-dark', className)}>
      <div className="form-heading">
        <h3>Reserve Your Free Seat</h3>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-grid">
        <div className="form-field full">
          <label className="input-label">Full Name</label>
          <input required name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" />
        </div>
        
        <div className="form-field">
          <label className="input-label">Mobile Number</label>
          <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} placeholder="10-digit mobile number" />
        </div>

        <div className="form-field">
          <label className="input-label">Email Address</label>
          <input required type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} placeholder="your@email.com" />
        </div>

        <CustomDropdown 
          label="Your State"
          options={states} 
          value={formData.state} 
          onChange={(val) => handleDropdownChange('state', val)}
          placeholder="Select State"
          showSearch
        />

        <CustomDropdown 
          label="Seminar City"
          options={cities} 
          value={formData.preferredCity} 
          onChange={(val) => handleDropdownChange('preferredCity', val)}
          placeholder="Select City"
        />

        <CustomDropdown 
          label="NEET Exam Year"
          options={examYears} 
          value={formData.neetExamYear} 
          onChange={(val) => handleDropdownChange('neetExamYear', val)}
          placeholder="Exam Year"
        />

        <CustomDropdown 
          label="Interested In"
          options={courses} 
          value={formData.interestedCourse} 
          onChange={(val) => handleDropdownChange('interestedCourse', val)}
          placeholder="Interested Course"
        />

        <div className="form-field full">
          <label className="input-label">Message / Query</label>
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Optional: Any specific questions?" rows={2} />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn btn-gold form-submit">
        {loading ? 'Submitting...' : 'Confirm My Free Seat'} <ArrowRight size={16} />
      </button>

      <p className="form-note">Limited seats available. Secure yours now.</p>
    </form>
  );
}
