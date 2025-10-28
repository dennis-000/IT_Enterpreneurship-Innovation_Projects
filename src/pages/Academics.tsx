import { Baby, BookOpen, GraduationCap, Clock, Users, Award } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const programs = [
  {
    icon: Baby,
    title: 'Creche',
    color: 'from-pink-500 to-rose-500',
    bgColor: 'from-pink-50 to-rose-50',
    description: 'A nurturing environment for our youngest learners',
    features: [
      'Safe and stimulating environment',
      'Age-appropriate play-based learning',
      'Early socialization skills',
      'Sensory and motor development',
      'Nutritious meals and snacks',
      'Trained caregivers and early childhood educators'
    ],
    curriculum: [
      'Basic communication and language development',
      'Fine and gross motor skills',
      'Social and emotional development',
      'Creative arts and music',
      'Sensory exploration activities'
    ]
  },
  {
    icon: BookOpen,
    title: 'Nursery',
    color: 'from-green-500 to-emerald-600',
    bgColor: 'from-green-50 to-emerald-50',
    description: 'Building early learning foundations',
    features: [
      'Structured play-based learning',
      'Early literacy and numeracy introduction',
      'Social skills development',
      'Creative expression activities',
      'Physical development programs',
      'Qualified early childhood educators'
    ],
    curriculum: [
      'Pre-reading and pre-writing skills',
      'Basic counting and number recognition',
      'Art and craft activities',
      'Music and movement',
      'Outdoor play and exploration'
    ]
  },
  {
    icon: BookOpen,
    title: 'Kindergarten',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'from-blue-50 to-indigo-50',
    description: 'Preparing for formal education',
    features: [
      'Structured learning environment',
      'School readiness preparation',
      'Social and emotional development',
      'Creative and critical thinking',
      'Physical education and sports',
      'Experienced kindergarten teachers'
    ],
    curriculum: [
      'Reading readiness and phonics',
      'Mathematics concepts and counting',
      'Science exploration',
      'Social studies introduction',
      'Art, music, and drama'
    ]
  },
  {
    icon: BookOpen,
    title: 'Primary School (Classes 1-6)',
    color: 'from-royal-500 to-blue-600',
    bgColor: 'from-royal-50 to-blue-50',
    description: 'Building strong foundations in core subjects',
    features: [
      'Comprehensive curriculum covering all subjects',
      'Experienced and qualified teachers',
      'Small class sizes for personalized attention',
      'Modern teaching methods and resources',
      'Regular assessments and progress reports',
      'Extracurricular activities and clubs'
    ],
    curriculum: [
      'English Language and Literacy',
      'Mathematics and Numeracy',
      'Science and Technology',
      'Social Studies',
      'Religious and Moral Education',
      'Creative Arts, Music, and Physical Education'
    ]
  },
  {
    icon: GraduationCap,
    title: 'Junior High School (JHS 1-3)',
    color: 'from-tomato-500 to-amber-600',
    bgColor: 'from-tomato-50 to-amber-50',
    description: 'Preparing students for excellence in BECE and beyond',
    features: [
      'BECE-focused curriculum',
      'Advanced learning resources',
      'Career guidance and counseling',
      'Leadership development programs',
      'Specialized subject teachers',
      'Mock exams and intensive preparation'
    ],
    curriculum: [
      'Core subjects: English, Mathematics, Science, Social Studies',
      'Elective subjects: Visual Arts, ICT, French, etc.',
      'Technical and Vocational Skills',
      'Life Skills Education',
      'BECE examination preparation',
      'Project work and research skills'
    ]
  }
];

const facilities = [
  { icon: BookOpen, title: 'Modern Library', desc: 'Well-stocked with books and digital resources' },
  { icon: Users, title: 'Science Laboratory', desc: 'Equipped for hands-on experiments' },
  { icon: Award, title: 'Computer Lab', desc: 'Latest technology and software' },
  { icon: Clock, title: 'Sports Facilities', desc: 'Fields and equipment for physical education' }
];

export default function Academics() {
  return (
    <div className="animate-fade-in">
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60 z-10" />
        <img
          src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="Academics at Fountain Gate Academy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Academics</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              A comprehensive educational journey from Creche to JHS (Ages 1 year and above)
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Academic Programs"
            subtitle="Quality education tailored to each developmental stage"
          />

          <div className="space-y-16">
            {programs.map((program, index) => {
              const Icon = program.icon;
              return (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${program.bgColor} rounded-3xl shadow-lg overflow-hidden animate-slide-up`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
                    <div>
                      <div className={`bg-gradient-to-br ${program.color} w-20 h-20 rounded-2xl flex items-center justify-center mb-6`}>
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h2 className="text-3xl font-bold text-royal-800 mb-4">{program.title}</h2>
                      <p className="text-lg text-gray-700 mb-6">{program.description}</p>

                      <h3 className="text-xl font-bold text-royal-700 mb-4">Key Features:</h3>
                      <ul className="space-y-3">
                        {program.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-tomato-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-royal-700 mb-4">Curriculum Highlights:</h3>
                      <div className="bg-white rounded-2xl p-6 shadow-md">
                        <ul className="space-y-3">
                          {program.curriculum.map((item, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="inline-block w-2 h-2 bg-royal-500 rounded-full mr-3 mt-2 flex-shrink-0" />
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 bg-white rounded-2xl p-6 shadow-md">
                        <h4 className="font-bold text-royal-700 mb-3">Class Schedule</h4>
                        <div className="space-y-2 text-gray-700">
                          <p><span className="font-semibold">School Hours:</span> 7:30 AM - 3:00 PM</p>
                          <p><span className="font-semibold">Break Time:</span> 10:00 AM - 10:30 AM</p>
                          <p><span className="font-semibold">Lunch:</span> 12:30 PM - 1:30 PM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Facilities"
            subtitle="Modern infrastructure supporting quality education"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-to-br from-royal-600 to-royal-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-royal-800 mb-3">{facility.title}</h3>
                  <p className="text-gray-600">{facility.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-royal-700 to-royal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Academic Excellence</h2>
            <p className="text-xl text-gray-200 mb-8">
              Our students consistently achieve outstanding results in the Basic Education Certificate Examination (BECE)
              and excel in their future academic pursuits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <p className="text-5xl font-bold text-tomato-400 mb-2">98%</p>
                <p className="text-gray-200">BECE Pass Rate</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <p className="text-5xl font-bold text-tomato-400 mb-2">85%</p>
                <p className="text-gray-200">Category A Schools</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20">
                <p className="text-5xl font-bold text-tomato-400 mb-2">50+</p>
                <p className="text-gray-200">Awards Won</p>
              </div>
            </div>
            <button className="bg-tomato-500 hover:bg-tomato-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Enroll Your Child Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
