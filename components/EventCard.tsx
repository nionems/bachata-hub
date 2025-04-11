          <div className="flex flex-col gap-2 mt-3">
            {event.ticketLink && (
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8 flex items-center justify-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(event.ticketLink, '_blank');
                }}
              >
                <Ticket className="h-4 w-4" />
                <span>Tickets</span>
              </Button>
            )}
            <div className="flex gap-2">
              {event.googleMapLink && (
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(event.googleMapLink, '_blank');
                  }}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Map</span>
                </Button>
              )}
              {event.eventLink && (
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(event.eventLink, '_blank');
                  }}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Website</span>
                </Button>
              )}
            </div>
          </div> 