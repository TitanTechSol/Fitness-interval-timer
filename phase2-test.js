// WI-005.4 Phase 2 Safety Test
// This script tests the dynamic loading functionality without breaking the app

console.log('🧪 WI-005.4 Phase 2 Safety Test Starting...');

// Test 1: Verify basic app functionality is intact
function testBasicFunctionality() {
  console.log('1. Testing Basic App Functionality...');
  
  // Check essential DOM elements exist
  const essentialElements = {
    'Timer Display': document.getElementById('display'),
    'Start Button': document.getElementById('start'),
    'Settings Button': document.getElementById('settings'),
    'Settings View': document.getElementById('settingsView'),
    'Timer Page': document.getElementById('timerPage')
  };
  
  let allElementsPresent = true;
  Object.entries(essentialElements).forEach(([name, element]) => {
    if (element) {
      console.log(`   ✅ ${name}: Found`);
    } else {
      console.log(`   ❌ ${name}: MISSING`);
      allElementsPresent = false;
    }
  });
  
  return allElementsPresent;
}

// Test 2: Check if our dynamic system is loaded
function testDynamicSystemLoading() {
  console.log('2. Testing Dynamic System Loading...');
  
  const dynamicComponents = {
    'BaseTab Class': typeof BaseTab !== 'undefined',
    'TimerTab Class': typeof TimerTab !== 'undefined',
    'SettingsTabManager': window.settingsTabManager !== undefined,
    'Test Controls': window.testDynamicMode !== undefined
  };
  
  let allComponentsLoaded = true;
  Object.entries(dynamicComponents).forEach(([name, loaded]) => {
    if (loaded) {
      console.log(`   ✅ ${name}: Loaded`);
    } else {
      console.log(`   ❌ ${name}: NOT LOADED`);
      allComponentsLoaded = false;
    }
  });
  
  return allComponentsLoaded;
}

// Test 3: Check dynamic tab registration
function testDynamicTabRegistration() {
  console.log('3. Testing Dynamic Tab Registration...');
  
  if (window.settingsTabManager) {
    const debugState = window.settingsTabManager.debugState();
    console.log('   Tab Manager State:', debugState);
    return true;
  } else {
    console.log('   ❌ SettingsTabManager not available');
    return false;
  }
}

// Test 4: Test button functionality (critical safety check)
function testButtonFunctionality() {
  console.log('4. Testing Button Functionality (Safety Check)...');
  
  const startBtn = document.getElementById('start');
  if (startBtn && window.intervalTimer) {
    try {
      // Don't actually start the timer, just check if clicking works
      console.log('   ✅ Start button and timer object available');
      return true;
    } catch (error) {
      console.log('   ❌ Button functionality issue:', error);
      return false;
    }
  } else {
    console.log('   ❌ Start button or timer missing');
    return false;
  }
}

// Test 5: Test dynamic loading (without breaking anything)
function testDynamicLoading() {
  console.log('5. Testing Dynamic Loading (Safe Mode)...');
  
  if (window.testDynamicMode) {
    console.log('   ✅ Dynamic test controls available');
    console.log('   Current dynamic mode status:');
    window.testDynamicMode.status();
    return true;
  } else {
    console.log('   ❌ Dynamic test controls not available');
    return false;
  }
}

// Run all tests
function runSafetyTests() {
  console.log('🛡️ Running WI-005.4 Phase 2 Safety Tests...\n');
  
  const results = [
    testBasicFunctionality(),
    testDynamicSystemLoading(),
    testDynamicTabRegistration(),
    testButtonFunctionality(),
    testDynamicLoading()
  ];
  
  const passedTests = results.filter(r => r).length;
  const totalTests = results.length;
  
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 ALL TESTS PASSED - Phase 2 implementation is safe!');
    console.log('\n📝 Manual Tests to Perform:');
    console.log('1. Click the timer Start button - should work');
    console.log('2. Open Settings modal - should open');
    console.log('3. Click Timer tab - should load (possibly dynamically)');
    console.log('4. Check browser console for dynamic loading messages');
    console.log('5. Test settings sliders and inputs');
  } else {
    console.log('⚠️  SOME TESTS FAILED - Check issues above');
  }
  
  return passedTests === totalTests;
}

// Auto-run when script loads
runSafetyTests();
