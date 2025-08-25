# Project Overview
This project is a rewrite of an existing React Native app (Salty Solutions) to use more modern versions of libraries.

## Project Structure
- **Legacy app**: `/Users/steven/code/personal/SaltySolutionsMobile`
- **New app (this project)**: `/Users/steven/code/personal/salty-solutions-mobile-v2b` using Expo
- **Backend server**: `/Users/steven/code/personal/salty-solutions` (runs on AWS Lambda with GraphQL)

## Technology Stack
- React Native with Expo (vanilla Expo preferred)
- GraphQL with Apollo Client
- Auth0 for authentication
- TypeScript
- React Native Reanimated
- Victory Native for charts
- React Native Skia

## GraphQL Configuration
- **Legacy app GraphQL**: `/Users/steven/code/personal/salty-solutions/shared/src/graphql/` 
- **Legacy codegen output**: `/Users/steven/code/personal/salty-solutions/shared/src/graphql/index.ts`
- **New app GraphQL**: `/Users/steven/code/personal/salty-solutions-mobile-v2b/graphql`
- **New app codegen output**: `/Users/steven/code/personal/salty-solutions-mobile-v2b/graphql/generated.tsx`
- **Production API URL**: `https://o2hlpsp9ac.execute-api.us-east-1.amazonaws.com/prod/api`
- **CodeGen command**: `npm run codegen`

## Development Commands
- `npm run start` - Start Expo development server
- `npm run android` - Run on Android
- `npm run ios` - Run on iOS  
- `npm run lint` - Run ESLint
- `npm run codegen` - Generate GraphQL types
