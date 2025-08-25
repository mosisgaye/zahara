import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, Gift } from 'lucide-react';

export default function Newsletter() {
  return (
    <section className="py-24 elegant-gradient">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm mb-10">
            <Mail className="h-10 w-10 text-white" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-crimson font-bold text-white mb-6 tracking-tight">
            Rejoignez Notre Cercle Privilégié
          </h2>
          
          <p className="text-xl text-white/90 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
            Découvrez en avant-première nos nouvelles créations et bénéficiez d'un accès exclusif 
            à nos collections limitées. Offre de bienvenue : 15% de réduction.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-8">
            <Input
              type="email"
              placeholder="Votre adresse email"
              className="bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 rounded-lg py-4 px-6 text-base"
            />
            <Button className="bg-white text-black hover:bg-gray-100 px-10 py-4 text-base font-semibold rounded-lg">
              S'inscrire
            </Button>
          </div>

          <div className="flex items-center justify-center space-x-3 text-white/70">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-medium">15% de réduction • Accès privilégié • Désabonnement simple</span>
          </div>
        </div>
      </div>
    </section>
  );
}