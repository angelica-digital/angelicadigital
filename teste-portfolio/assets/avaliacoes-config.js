/* ============== CONEXÃO DAS AVALIAÇÕES (Supabase) ==============
   Preencha com os dados do projeto Supabase PRÓPRIO do site Angélica Digital
   (Project Settings → API / Data API):

     supabaseUrl  → "Project URL", por exemplo https://xxxxxxxxxxxx.supabase.co
     chavePublica → a chave PUBLICÁVEL do navegador ("publishable" ou "anon public").

   NUNCA coloque aqui a chave "secret" / "service_role": ela ignora todas as regras de segurança.
   A chave pública é visível para qualquer visitante — por isso as regras ficam no banco
   (teste-portfolio/supabase/avaliacoes_site.sql).

   Enquanto os dois campos estiverem vazios, o formulário fica desativado e a lista
   mostra o estado inicial, sem nenhuma avaliação.
*/
window.AVALIACOES_CONFIG = window.AVALIACOES_CONFIG || {
  supabaseUrl: 'https://nmpzzxmsojnrqkdjaiwi.supabase.co',   // projeto Angélica Digital — Site
  chavePublica: 'sb_publishable_pWcxKPAqpf4EKaSXfiYyQw_KKhC3EA7'   // chave publishable (pública por natureza)
};
