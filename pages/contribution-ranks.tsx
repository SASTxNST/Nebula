import dynamic from 'next/dynamic';

const ContributionRanks = dynamic(() => import('../src/app/pages/ContributionRanks'), {
  ssr: false,
});

export default function ContributionRanksPage() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        margin: 0,
        padding: 0,
        width: '100vw',
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        // backgroundImage: 'url("/nebula.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'brightness(1.1)',
      }}
    >
      
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <ContributionRanks />
      </div>
    </div>
  );
}
