import {
  HeartIcon,
  BookmarkIcon,
  UsersIcon,
  FileTextIcon,
} from 'lucide-react';

const StatItem = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center gap-3">
    <div
      className={`p-2 rounded-full bg-${color}-100 text-${color}-600`}
    >
      <Icon className="w-5 h-5" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

const ProfileStats = ({ stats }) => {
  return (
    <div className="mt-10 bg-gray-50 border border-gray-200 rounded-xl p-6 grid grid-cols-2 sm:grid-cols-2 gap-6">
      <StatItem
        icon={FileTextIcon}
        label="Postingan Buletin"
        value={stats.posts}
        color="blue"
      />
      <StatItem
        icon={HeartIcon}
        label="Jumlah Suka"
        value={stats.likes}
        color="red"
      />
      <StatItem
        icon={BookmarkIcon}
        label="Jumlah postingan tersimpan"
        value={stats.bookmarks}
        color="purple"
      />
      <StatItem
        icon={UsersIcon}
        label="Subscriber"
        value={stats.subscribers}
        color="emerald"
      />
    </div>
  );
};

export default ProfileStats;
