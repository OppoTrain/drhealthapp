module.exports = {
  root: true, // Make sure ESLint doesn't look for config files in parent folders
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser for TypeScript
 parserOptions: {
    ecmaVersion: 'latest', // Allows the use of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: ['./tsconfig.json'], // if using typescript...Specify the path to your tsconfig.json file  
    tsconfigRootDir: __dirname, // helps eslint find your tsconfig
   
  },



  extends: [       
      "next/core-web-vitals",// if using nextjs
        'eslint:recommended', // Uses ESLint's recommended rules as a base
        'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint plugin
       // 'plugin:@typescript-eslint/recommended-requiring-type-checking', //Optional: Enforce type checking  (More strict)
     'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.

  ],


  rules: {
    // Add your custom rules here, or override the ones from the extended configs
     '@typescript-eslint/no-explicit-any': 'off', // or "warn" or configure options
    
  },

  plugins: [
        "@typescript-eslint",
       'prettier'  // Make sure to include the prettier plugin in your plugins array.
  ],



};
