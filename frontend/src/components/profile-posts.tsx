import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export interface Post {
  uuid: string,
  title: string,
  date: string,
  location: { lat: any; lng: any; place_id: any } | null,
  photoURI: string,
  description: string,
  experienceTypes: string[],
  price: number,
  rating: number
}

interface ProfilePostsProps {
  journalEntries: Post[];
  onPostPress: (post: Post) => void;
  onEditPost: (post: Post) => void;
}

export function ProfilePosts({ journalEntries, onPostPress, onEditPost }: ProfilePostsProps) {
  return (
    <View style={styles.profilePostsSection}>
      <Text style={styles.sectionTitle}>Entries</Text>

      {journalEntries.length > 0 ? (
        journalEntries.map((entry) => (
          <TouchableOpacity key={entry.uuid} onPress={() => onPostPress(entry)}>
            <View style={styles.postItem}>
              <Text style={styles.postItemText}>{entry.title}</Text>
            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.postItemText}>No entries yet.</Text>
      )}
    </View>
  );
}

interface PostDetailsProps {
  post: Post;
  onClose: () => void;
  onEdit: () => void;  // Edit function to reopen the form
}

export function PostDetails({ post, onClose, onEdit }: PostDetailsProps) {
  return (
    <View style={styles.postDetailsContainer}>
      <Text style={styles.detailsTitle}>{post.title}</Text>
      <Text style={styles.detailsDate}>{new Date(post.date).toDateString()}</Text> {/* Format the date */}
      <Text style={styles.detailsDescription}>{post.description}</Text>
      {post.photoURI && (
        <Image source={{ uri: post.photoURI }} style={styles.photoPreview} />
      )}
      <Text style={styles.detailsExperienceTypes}>Experience Types: {post.experienceTypes.join(', ')}</Text>
      <Text style={styles.detailsPrice}>Price: ${post.price}</Text>
      <Text style={styles.detailsRating}>Rating: {post.rating} stars</Text>

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePostsSection: {
    width: '100%',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 10,
  },
  postItem: {
    backgroundColor: '#3a3f47',
    width: '100%',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },
  postItemText: {
    color: '#fff',
    fontSize: 16,
  },
  // Post details styles
  postDetailsContainer: {
    backgroundColor: '#25292e',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  detailsDate: {
    fontSize: 16,
    color: '#aaa',
    marginVertical: 5,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
    textAlign: 'center',
  },
  photoPreview: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailsExperienceTypes: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  detailsPrice: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 5,
  },
  detailsRating: {
    fontSize: 16,
    color: '#ffd700',
    marginBottom: 15,
  },
  editButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 10,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// export interface Post {
//   uuid: string;
//   title: string;
//   description: string;
//   photoURI: string;
//   rating: number;
// }

// interface ProfilePostsProps {
//   journalEntries: Post[];
//   onPostPress: (post: Post) => void;
// }

// export function ProfilePosts({ journalEntries, onPostPress }: ProfilePostsProps) {
//   return (
//     <View style={styles.profilePostsSection}>
//       <Text style={styles.sectionTitle}>Entries</Text>
//       {journalEntries.length > 0 ? (
//         journalEntries.map((entry) => (
//           <TouchableOpacity key={entry.uuid} onPress={() => onPostPress(entry)}>
//             <View style={styles.postItem}>
//               <Text style={styles.postItemText}>{entry.title}</Text>
//             </View>
//           </TouchableOpacity>
//         ))
//       ) : (
//         <Text style={styles.postItemText}>No posts yet.</Text>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   profilePostsSection: {
//     width: '100%',
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     color: '#fff',
//     marginBottom: 10,
//   },
//   postItem: {
//     backgroundColor: '#3a3f47',
//     width: '100%',
//     padding: 10,
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   postItemText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });
