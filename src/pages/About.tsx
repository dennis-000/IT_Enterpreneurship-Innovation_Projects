import { Target, Eye, History, Users } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const leadership = [
  {
    name: 'Dr. Kwame Mensah',
    position: 'Headmaster',
    image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Over 20 years of experience in educational leadership'
  },
  {
    name: 'Mrs. Ama Boateng',
    position: 'Deputy Headmistress',
    image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Specialist in curriculum development and teacher training'
  },
  {
    name: 'Mr. Kofi Asante',
    position: 'Academic Coordinator',
    image: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Expert in educational technology and innovation'
  },
  {
    name: 'Ms. Akua Owusu',
    position: 'Student Affairs Director',
    image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=400',
    bio: 'Dedicated to student welfare and development'
  }
];

export default function About() {
  return (
    <div className="animate-fade-in">
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60 z-10" />
        <img
          src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt="About Fountain Gate Academy"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Learn about our mission, vision, and the dedicated team that makes Fountain Gate Academy a place of excellence for children from ages 1 year and above
            </p>
          </div>
        </div>
      </div>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <div className="bg-gradient-to-br from-royal-50 to-blue-50 p-10 rounded-3xl shadow-lg animate-slide-up">
              <div className="bg-royal-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-royal-800 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To provide quality, affordable, and accessible education that nurtures academic excellence,
                character development, and leadership skills in every child. We are committed to creating
                a safe, supportive learning environment where students develop into well-rounded individuals
                prepared for the challenges of tomorrow.
              </p>
            </div>

            <div className="bg-gradient-to-br from-tomato-50 to-red-50 p-10 rounded-3xl shadow-lg animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="bg-tomato-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-tomato-800 mb-4">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To be the leading basic school in Ghana, recognized for academic excellence, moral integrity,
                and holistic child development. We envision a future where every Fountain Gate Academy graduate
                becomes a responsible citizen, critical thinker, and positive contributor to society.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white p-10 rounded-3xl shadow-lg animate-fade-in">
            <div className="flex items-center mb-6">
              <div className="bg-royal-600 w-16 h-16 rounded-2xl flex items-center justify-center mr-4">
                <History className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-royal-800">Our History</h2>
            </div>
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Fountain Gate Academy was established in 2009 with a vision to transform basic education
                in Ghana. What began as a small school with just 30 students has grown into a thriving
                educational institution serving over 500 students from Creche to JHS (ages 1 year and above).
              </p>
              <p className="text-lg">
                Over the years, we have consistently maintained our commitment to academic excellence and
                character development. Our school has produced numerous outstanding students who have gone
                on to excel in senior high schools and beyond. We take pride in our track record of
                academic achievements, including top performances in the Basic Education Certificate
                Examination (BECE).
              </p>
              <p className="text-lg">
                Our state-of-the-art facilities, including modern classrooms, science laboratories, computer
                labs, and a well-stocked library, provide students with an environment conducive to learning
                and growth. We continue to invest in infrastructure and educational resources to ensure our
                students receive the best education possible.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Our Leadership Team"
            subtitle="Meet the dedicated professionals guiding our educational excellence"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {leadership.map((leader, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-royal-900/80 to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-royal-800 mb-2">{leader.name}</h3>
                  <p className="text-tomato-600 font-semibold mb-3">{leader.position}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{leader.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-royal-700 to-royal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="bg-tomato-500 w-20 h-20 rounded-2xl flex items-center justify-center">
                <Users className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto mb-12">
              The principles that guide everything we do at Fountain Gate Academy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Excellence', desc: 'Striving for the highest standards in all we do' },
              { title: 'Integrity', desc: 'Upholding honesty and strong moral principles' },
              { title: 'Respect', desc: 'Valuing diversity and treating everyone with dignity' },
              { title: 'Innovation', desc: 'Embracing creativity and new approaches to learning' },
              { title: 'Responsibility', desc: 'Taking ownership of actions and their consequences' },
              { title: 'Compassion', desc: 'Showing kindness and care for others' }
            ].map((value, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                <h3 className="text-2xl font-bold text-tomato-400 mb-3">{value.title}</h3>
                <p className="text-gray-200">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
