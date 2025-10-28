import { useState } from 'react';
import { FileText, CheckCircle, Calendar, UserPlus, Download, Phone, Mail } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { supabase } from '../lib/supabase';

const admissionSteps = [
  {
    icon: FileText,
    title: 'Submit Inquiry',
    description: 'Fill out our online inquiry form with your details'
  },
  {
    icon: Calendar,
    title: 'Schedule Visit',
    description: 'Tour our facilities and meet our staff'
  },
  {
    icon: UserPlus,
    title: 'Complete Application',
    description: 'Submit required documents and application fee'
  },
  {
    icon: CheckCircle,
    title: 'Enrollment',
    description: 'Receive acceptance and complete enrollment'
  }
];

const requirements = [
  'Birth certificate of the child',
  'Recent passport-sized photographs (4 copies)',
  'Immunization records',
  'Previous school report cards (if applicable)',
  'Parent/Guardian identification',
  'Proof of residence'
];

export default function Admissions() {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    phone: '',
    studentName: '',
    studentAge: '',
    gradeLevel: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const { error } = await supabase.from('admission_inquiries').insert([
        {
          parent_name: formData.parentName,
          email: formData.email,
          phone: formData.phone,
          student_name: formData.studentName,
          student_age: formData.studentAge,
          grade_level: formData.gradeLevel,
          message: formData.message
        }
      ]);

      if (error) throw error;

      setSubmitStatus('success');
      setFormData({
        parentName: '',
        email: '',
        phone: '',
        studentName: '',
        studentAge: '',
        gradeLevel: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60 z-10" />
        <img
          src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Admissions at Fountain Gate Academy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Admissions</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Join the Fountain Gate Academy family and give your child the gift of quality education from ages 1 year and above
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Admission Process"
            subtitle="Four simple steps to enroll your child"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {admissionSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-to-br from-royal-50 to-blue-50 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-royal-200">
                    <div className="bg-gradient-to-br from-royal-600 to-royal-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-4 -left-4 bg-tomato-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-royal-800 mb-3 text-center">{step.title}</h3>
                    <p className="text-gray-600 text-center">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-slide-up">
              <div className="bg-gradient-to-br from-tomato-50 to-amber-50 p-8 rounded-3xl shadow-lg mb-8">
                <h2 className="text-3xl font-bold text-royal-800 mb-6">Required Documents</h2>
                <ul className="space-y-4">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-6 h-6 text-tomato-600 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-lg">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-royal-700 to-royal-800 text-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Download Prospectus</h3>
                <p className="text-gray-200 mb-6">
                  Get detailed information about our programs, fees, and facilities.
                </p>
                <button className="bg-tomato-500 hover:bg-tomato-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg flex items-center space-x-2">
                  <Download className="w-5 h-5" />
                  <span>Download Prospectus (PDF)</span>
                </button>
              </div>
            </div>

            <div className="animate-fade-in">
              <div className="bg-white border-2 border-royal-200 rounded-3xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-royal-800 mb-6">Admission Inquiry Form</h2>

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-xl mb-6 flex items-center">
                    <CheckCircle className="w-6 h-6 mr-3 flex-shrink-0" />
                    <p>Thank you! Your inquiry has been submitted successfully. We will contact you soon.</p>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border-2 border-red-500 text-red-700 p-4 rounded-xl mb-6">
                    <p>Sorry, there was an error submitting your inquiry. Please try again.</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Parent/Guardian Name *
                    </label>
                    <input
                      type="text"
                      name="parentName"
                      value={formData.parentName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors"
                        placeholder="+233 24 123 4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors"
                      placeholder="Enter student's full name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Student Age *
                      </label>
                      <input
                        type="text"
                        name="studentAge"
                        value={formData.studentAge}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors"
                        placeholder="e.g., 5 years"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Desired Level *
                      </label>
                      <select
                        name="gradeLevel"
                        value={formData.gradeLevel}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors bg-white"
                      >
                        <option value="">Select level</option>
                        <option value="Creche">Creche</option>
                        <option value="Kindergarten">Kindergarten</option>
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                        <option value="JHS 1">JHS 1</option>
                        <option value="JHS 2">JHS 2</option>
                        <option value="JHS 3">JHS 3</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Additional Message
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-royal-500 focus:outline-none transition-colors resize-none"
                      placeholder="Any additional information or questions..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-royal-600 to-royal-700 hover:from-royal-700 hover:to-royal-800 text-white px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
                  </button>
                </form>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-royal-50 p-6 rounded-2xl border-2 border-royal-200">
                  <Phone className="w-8 h-8 text-royal-600 mb-3" />
                  <h4 className="font-bold text-royal-800 mb-2">Call Us</h4>
                  <p className="text-gray-700">+233 24 123 4567</p>
                </div>
                <div className="bg-tomato-50 p-6 rounded-2xl border-2 border-tomato-200">
                  <Mail className="w-8 h-8 text-tomato-600 mb-3" />
                  <h4 className="font-bold text-tomato-800 mb-2">Email Us</h4>
                  <p className="text-gray-700">admissions@fountaingate.edu.gh</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
