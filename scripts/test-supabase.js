/**
 * Supabase 连接测试脚本
 * 运行: node scripts/test-supabase.js
 */

// 注意：需要先配置 .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ 错误：缺少 Supabase 配置');
  console.error('请确保 .env.local 中已配置：');
  console.error('  - NEXT_PUBLIC_SUPABASE_URL');
  console.error('  - NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('🔍 测试 Supabase 连接...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // 测试连接
    console.log('1️⃣ 测试数据库连接...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation') || error.message.includes('does not exist')) {
        console.log('⚠️  数据库表尚未创建');
        console.log('   请运行数据库迁移脚本\n');
        return false;
      }
      throw error;
    }

    console.log('✅ 数据库连接成功！\n');

    // 测试认证
    console.log('2️⃣ 测试认证服务...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError) throw authError;

    console.log('✅ 认证服务正常！\n');

    console.log('🎉 所有测试通过！Supabase 配置正确。\n');
    return true;

  } catch (error) {
    console.error('❌ 连接失败：', error.message);
    console.error('\n请检查：');
    console.error('  1. Supabase 项目 URL 是否正确');
    console.error('  2. API 密钥是否正确');
    console.error('  3. 项目是否已完成初始化\n');
    return false;
  }
}

testConnection()
  .then((success) => {
    process.exit(success ? 0 : 1);
  });
