import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
  ScrollView,
} from 'react-native';
import { useUserContext } from '@/context/UserContext';
import { gray, white } from '@/constants/colors';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const { actions, user } = useUserContext();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.header}>Your Account</Text>
        {user.loading ? (
          <Paragraph>Checking your login status...</Paragraph>
        ) : !user.isLoggedIn ? (
          <View>
            <Paragraph>
              Click the "Login" button below to access all features of Salty
              Solutions.
            </Paragraph>
            <TouchableOpacity style={styles.loginButton} onPress={actions.login}>
              <Text style={styles.buttonText}>Login to Salty Solutions</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Paragraph>You're logged in as {(user as any).name}!</Paragraph>
            {(user as any).email && (
              <Paragraph>Email: {(user as any).email}</Paragraph>
            )}
            <Paragraph>
              Premium Status: {user.entitledToPremium ? 'Active' : 'Inactive'}
            </Paragraph>
            <TouchableOpacity style={styles.logoutButton} onPress={actions.logout}>
              <Text style={styles.buttonText}>Logout from Salty Solutions</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {user.isLoggedIn === false && 'error' in user && user.error && (
          <Text style={styles.errorText}>{user.error}</Text>
        )}
      </View>

      <View style={[styles.section, styles.sectionWithBorder]}>
        <Text style={styles.header}>About</Text>
        <Paragraph>
          Hi, I'm Steven Musumeche, a resident of Lafayette, LA and avid
          saltwater fisherman. I created Salty Solutions to answer a question
          that I'm always asking myself:
        </Paragraph>
        <Text style={[styles.when, styles.paragraph]}>
          WHEN SHOULD I GO FISHING?
        </Text>
        <Paragraph>
          Like most of you, I have a limited amount of time that I can devote to
          fishing. When I plan my next fishing trip, I want to make sure the
          conditions are conducive to a productive day on the water.
        </Paragraph>
        <Paragraph>
          There are lots of great websites and apps available with information
          about weather, tides, and more. However, none of them gave me
          everything that I wanted to know in a way that could be quickly viewed
          and easily digested.
        </Paragraph>
        <Paragraph>
          I'm a software engineer by trade, so I thought, "hey, I can make
          something decent enough for personal use." After showing it to a few
          fellow fisherman, I decided to release it publically for everyone to
          use.
        </Paragraph>
        <Paragraph>
          I hope you find it useful - please contact me with any suggestions or
          comments.
        </Paragraph>
        <TouchableOpacity
          style={styles.privacyButton}
          onPress={() => Linking.openURL('https://salty.solutions/privacy')}
        >
          <Text style={styles.privacyButtonText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.versionText}>
          App: {Constants.expoConfig?.version || '1.0.0'}, Code: 2.1.0
        </Text>
      </View>

      <View style={styles.socialSection}>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              `mailto:steven@musumeche.com?subject=Salty Solutions ${
                Platform.OS === 'ios' ? 'iOS' : 'Android'
              } App`,
            ).catch()
          }
        >
          <MaterialIcons name="email" size={48} color={white} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://www.facebook.com/musumeche')}
        >
          <FontAwesome name="facebook-square" size={48} color="#3b5998" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://twitter.com/smusumeche')}
        >
          <FontAwesome name="twitter" size={48} color="#1DA1F2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            Linking.openURL('https://www.linkedin.com/in/smusumeche')
          }
        >
          <FontAwesome name="linkedin-square" size={48} color="#0e76a8" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('https://github.com/stevenmusumeche')}
        >
          <FontAwesome name="github" size={48} color={white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const Paragraph: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: gray[900],
  },
  section: {
    padding: 20,
  },
  sectionWithBorder: {
    backgroundColor: gray[800],
    borderTopColor: gray[700],
    borderTopWidth: 1,
    borderBottomColor: gray[700],
    borderBottomWidth: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 15,
    color: white,
    fontWeight: '600',
  },
  when: {
    fontWeight: '500',
    color: white,
  },
  paragraph: {
    marginBottom: 15,
    color: gray[300],
    lineHeight: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: white,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  privacyButton: {
    backgroundColor: gray[700],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 15,
  },
  privacyButtonText: {
    color: white,
    fontSize: 16,
    textAlign: 'center',
  },
  versionText: {
    color: gray[500],
    textAlign: 'center',
    fontSize: 12,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 10,
  },
  socialSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
});
