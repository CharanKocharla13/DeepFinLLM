const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-muted py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} DeepFinLLM. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-4">
            <a href="#" className="hover:text-primary transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors duration-200">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
